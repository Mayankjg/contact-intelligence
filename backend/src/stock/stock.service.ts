import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  ProductStatus,
  StockMovementStatus,
  StockMovementType,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { CreateStockClosureDto } from './dto/create-stock-closure.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';
import { createStockDocumentNumber } from './stock-number';
import { ensureStockPeriodOpen } from './stock-period';

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
            const product = await tx.product.findUnique({
              where: { id: dto.productId },
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
                status:
                  stockAfter > 0
                    ? ProductStatus.ACTIVE
                    : ProductStatus.INACTIVE,
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

  async closePeriod(dto: CreateStockClosureDto) {
    const startDate = new Date(`${dto.startDate.slice(0, 10)}T00:00:00.000Z`);
    const endDate = new Date(`${dto.endDate.slice(0, 10)}T23:59:59.999Z`);
    if (startDate > endDate)
      throw new BadRequestException('Start date must be before end date');

    try {
      const closure = await this.prisma.$transaction(
        async (tx) => {
          const existing = await tx.stockClosure.findUnique({
            where: { startDate_endDate: { startDate, endDate } },
            include: { lines: { orderBy: { productName: 'asc' } } },
          });
          if (existing) return { data: existing, alreadyClosed: true };

          const [products, movements] = await Promise.all([
            tx.product.findMany({ orderBy: { name: 'asc' } }),
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
            const productMovements =
              movementsByProduct.get(movement.productId) ?? [];
            productMovements.push(movement);
            movementsByProduct.set(movement.productId, productMovements);
          }
          const lines = products.map((product) => {
            const productMovements = movementsByProduct.get(product.id) ?? [];
            const during = productMovements.filter(
              (movement) => movement.occurredAt >= startDate,
            );
            const before = productMovements.filter(
              (movement) => movement.occurredAt < startDate,
            );
            const opening =
              before[before.length - 1]?.stockAfter ??
              during[0]?.stockBefore ??
              product.stock;
            const inward = during.reduce(
              (sum, movement) =>
                sum +
                (movement.type === StockMovementType.INWARD
                  ? movement.quantity
                  : 0),
              0,
            );
            const outward = during.reduce(
              (sum, movement) =>
                sum +
                (movement.type === StockMovementType.OUTWARD
                  ? movement.quantity
                  : 0),
              0,
            );
            return {
              productId: product.id,
              productName: product.name,
              sku: product.sku,
              opening,
              inward,
              outward,
              closing: opening + inward - outward,
            };
          });

          const data = await tx.stockClosure.create({
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
