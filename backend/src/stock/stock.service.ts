import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  StockMovementStatus,
  StockMovementType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateStockClosureDto } from './dto/create-stock-closure.dto';
import { ReopenStockPeriodDto } from './dto/reopen-stock-period.dto';
import { StockDailyReportQueryDto } from './dto/stock-daily-report-query.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { createStockDocumentNumber } from './stock-number';
import { ensureStockPeriodOpen } from './stock-period';

// Stock reports use calendar dates in the business timezone, Asia/Kolkata.
// Convert date-only inputs to instants at that timezone's day boundaries so
// movements near midnight are assigned to the date users see in the UI.
function businessDayStart(date: string) {
  return new Date(`${date.slice(0, 10)}T00:00:00.000+05:30`);
}

function businessDayEnd(date: string) {
  return new Date(`${date.slice(0, 10)}T23:59:59.999+05:30`);
}

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(dto: CreateStockMovementDto) {
    if (dto.type === StockMovementType.INWARD && !dto.supplier?.trim()) {
      throw new BadRequestException(
        'Supplier is required for inward stock movement',
      );
    }
    if (
      dto.type === StockMovementType.OUTWARD &&
      (!dto.purpose || !dto.customer?.trim())
    ) {
      throw new BadRequestException(
        'Customer/recipient and purpose are required for outward stock movement',
      );
    }
    const occurredAt = dto.occurredAt ? new Date(dto.occurredAt) : new Date();

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            await ensureStockPeriodOpen(tx, occurredAt);
            const product = await tx.product.findFirst({
              where: { id: dto.productId, deletedAt: null },
            });

            if (!product) {
              throw new NotFoundException('Product not found');
            }

            if (
              dto.type === StockMovementType.OUTWARD &&
              product.stock < dto.quantity
            ) {
              throw new BadRequestException(
                `Only ${product.stock} units are currently in stock`,
              );
            }

            const stockBefore = product.stock;
            const stockAfter =
              dto.type === StockMovementType.INWARD
                ? stockBefore + dto.quantity
                : stockBefore - dto.quantity;

            const updatedProduct = await tx.product.update({
              where: { id: product.id },
              data: {
                stock:
                  dto.type === StockMovementType.INWARD
                    ? { increment: dto.quantity }
                    : { decrement: dto.quantity },
              },
            });

            const movement = await tx.stockMovement.create({
              data: {
                documentNo: createStockDocumentNumber(dto.type),
                productId: product.id,
                type: dto.type,
                status:
                  dto.type === StockMovementType.INWARD
                    ? StockMovementStatus.RECEIVED
                    : StockMovementStatus.DELIVERED,
                quantity: dto.quantity,
                stockBefore,
                stockAfter,
                supplier: dto.supplier?.trim() || undefined,
                customer: dto.customer?.trim() || undefined,
                purpose: dto.purpose,
                invoiceNo: dto.invoiceNo?.trim() || undefined,
                unitPrice: dto.unitPrice,
                batchNo: dto.batchNo?.trim() || undefined,
                warehouse: dto.warehouse?.trim() || 'Main Warehouse',
                notes: dto.notes?.trim() || undefined,
                occurredAt,
              },
              include: { product: true },
            });

            return {
              success: true,
              data: movement,
              currentStock: updatedProduct.stock,
            };
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2034';
        if (retryable && attempt < 2) continue;
        throw error;
      }
    }

    throw new BadRequestException(
      'Stock changed during this request. Please try again.',
    );
  }

  async findMovements(query: StockMovementQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: Prisma.StockMovementWhereInput = {
      ...(query.type ? { type: query.type } : {}),
      ...(query.productId ? { productId: query.productId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.stockMovement.findMany({
        where,
        include: { product: true },
        orderBy: [{ occurredAt: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.stockMovement.count({ where }),
    ]);

    return {
      success: true,
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getDailyReport(query: StockDailyReportQueryDto) {
    const startDate = businessDayStart(query.startDate);
    const endDate = businessDayEnd(query.endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const product = await this.prisma.product.findFirst({
      where: { id: query.productId, deletedAt: null },
      select: { id: true, name: true, stock: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const movements = await this.prisma.stockMovement.findMany({
      where: { productId: product.id, occurredAt: { lte: endDate } },
      orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }],
      select: {
        type: true,
        quantity: true,
        stockBefore: true,
        stockAfter: true,
        occurredAt: true,
      },
    });

    const before = movements.filter((movement) => movement.occurredAt < startDate);
    const during = movements.filter((movement) => movement.occurredAt >= startDate);
    // Rebuild the balance from the movement ledger. stockBefore/stockAfter are
    // transaction-time snapshots and can be misleading when entries are
    // recorded later with an earlier business date.
    const firstPriorMovementBalance = before[0]?.stockBefore ?? 0;
    let opening = before.reduce(
      (balance, movement) =>
        balance +
        (movement.type === StockMovementType.INWARD
          ? movement.quantity
          : -movement.quantity),
      firstPriorMovementBalance,
    );
    const rows: Array<{
      date: string;
      productId: string;
      productName: string;
      opening: number;
      inward: number;
      outward: number;
      closing: number;
    }> = [];

    for (
      const day = new Date(`${query.startDate.slice(0, 10)}T00:00:00.000Z`),
        lastDay = new Date(`${query.endDate.slice(0, 10)}T00:00:00.000Z`);
      day <= lastDay;
      day.setUTCDate(day.getUTCDate() + 1)
    ) {
      const date = day.toISOString().slice(0, 10);
      const dayStart = businessDayStart(date);
      const dayEnd = businessDayEnd(date);
      const dayMovements = during.filter(
        (movement) => movement.occurredAt >= dayStart && movement.occurredAt <= dayEnd,
      );
      const inward = dayMovements.reduce(
        (sum, movement) => sum + (movement.type === StockMovementType.INWARD ? movement.quantity : 0),
        0,
      );
      const outward = dayMovements.reduce(
        (sum, movement) => sum + (movement.type === StockMovementType.OUTWARD ? movement.quantity : 0),
        0,
      );
      const closing = opening + inward - outward;
      rows.push({ date, productId: product.id, productName: product.name, opening, inward, outward, closing });
      opening = closing;
    }

    return { success: true, product, data: rows };
  }

  private async calculateClosureLines(
    tx: Prisma.TransactionClient,
    startDate: Date,
    endDate: Date,
  ) {
    const [products, movements] = await Promise.all([
      tx.product.findMany({ where: { deletedAt: null }, orderBy: { name: 'asc' } }),
      tx.stockMovement.findMany({
        where: { occurredAt: { lte: endDate } },
        orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }],
        select: {
          productId: true,
          type: true,
          quantity: true,
          stockBefore: true,
          stockAfter: true,
          occurredAt: true,
        },
      }),
    ]);
    const movementsByProduct = new Map<string, typeof movements>();
    for (const movement of movements) {
      const productMovements = movementsByProduct.get(movement.productId) ?? [];
      productMovements.push(movement);
      movementsByProduct.set(movement.productId, productMovements);
    }

    return products.map((product) => {
      const productMovements = movementsByProduct.get(product.id) ?? [];
      const before = productMovements.filter(
        (movement) => movement.occurredAt < startDate,
      );
      const during = productMovements.filter(
        (movement) => movement.occurredAt >= startDate,
      );
      const inward = during.reduce(
        (sum, movement) =>
          sum +
          (movement.type === StockMovementType.INWARD ? movement.quantity : 0),
        0,
      );
      const outward = during.reduce(
        (sum, movement) =>
          sum +
          (movement.type === StockMovementType.OUTWARD ? movement.quantity : 0),
        0,
      );
      const firstPriorMovementBalance = before[0]?.stockBefore ?? 0;
      const opening = before.reduce(
        (balance, movement) =>
          balance +
          (movement.type === StockMovementType.INWARD
            ? movement.quantity
            : -movement.quantity),
        firstPriorMovementBalance,
      );
      return {
        productId: product.id,
        productName: product.name,
        opening,
        inward,
        outward,
        closing: opening + inward - outward,
      };
    });
  }

  async previewPeriod(dto: CreateStockClosureDto) {
    const startDate = businessDayStart(dto.startDate);
    const endDate = businessDayEnd(dto.endDate);
    if (startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const todayInBusinessTimezone = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
    }).format(new Date());
    if (dto.endDate.slice(0, 10) > todayInBusinessTimezone) {
      throw new BadRequestException('A closing preview cannot include future dates.');
    }

    const lines = await this.prisma.$transaction((tx) =>
      this.calculateClosureLines(tx, startDate, endDate),
    );
    return {
      success: true,
      alreadyClosed: false,
      data: { id: 'live-preview', startDate, endDate, lines },
    };
  }

  async reopenPeriod(dto: ReopenStockPeriodDto) {
    const date = businessDayStart(dto.date);
    // Also match closures created before report dates were stored using the
    // Asia/Kolkata business-day boundary (the legacy boundary was UTC).
    const legacyDate = new Date(`${dto.date.slice(0, 10)}T00:00:00.000Z`);
    const result = await this.prisma.stockClosure.updateMany({
      where: {
        OR: [
          { startDate: { lte: date }, endDate: { gte: date } },
          { startDate: { lte: legacyDate }, endDate: { gte: legacyDate } },
        ],
        reopenedAt: null,
      },
      data: { reopenedAt: new Date() },
    });

    return { success: true, reopened: result.count > 0 };
  }

  async closePeriod(dto: CreateStockClosureDto) {
    const todayInBusinessTimezone = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
    }).format(new Date());
    if (dto.endDate.slice(0, 10) >= todayInBusinessTimezone) {
      throw new BadRequestException(
        'A stock period can only be closed through yesterday. Keep today open for stock entries.',
      );
    }

    const startDate = businessDayStart(dto.startDate);
    const endDate = businessDayEnd(dto.endDate);
    if (startDate > endDate)
      throw new BadRequestException('Start date must be before end date');

    try {
      const closure = await this.prisma.$transaction(
        async (tx) => {
          const existing = await tx.stockClosure.findUnique({
            where: { startDate_endDate: { startDate, endDate } },
            include: { lines: { orderBy: { productName: 'asc' } } },
          });
          if (existing && !existing.reopenedAt) {
            return { data: existing, alreadyClosed: true };
          }

          const lines = await this.calculateClosureLines(tx, startDate, endDate);

          const data = existing
            ? await tx.stockClosure.update({
                where: { id: existing.id },
                data: {
                  reopenedAt: null,
                  lines: { deleteMany: {}, create: lines },
                },
                include: { lines: { orderBy: { productName: 'asc' } } },
              })
            : await tx.stockClosure.create({
                data: { startDate, endDate, lines: { create: lines } },
                include: { lines: { orderBy: { productName: 'asc' } } },
              });
          return { data, alreadyClosed: false };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
      return { success: true, ...closure };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const closure = await this.prisma.stockClosure.findUnique({
          where: { startDate_endDate: { startDate, endDate } },
          include: { lines: { orderBy: { productName: 'asc' } } },
        });
        if (closure)
          return { success: true, data: closure, alreadyClosed: true };
      }
      throw error;
    }
  }
}
