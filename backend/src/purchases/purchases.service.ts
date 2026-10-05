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
  StockOutwardPurpose,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { createStockDocumentNumber } from '../stock/stock-number';
import { ensureStockPeriodOpen } from '../stock/stock-period';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  private generatePurchaseNumber() {
    const timestamp = Date.now().toString().slice(-8);

    const random = Math.floor(1000 + Math.random() * 9000);

    return `INV-${timestamp}-${random}`;
  }

  async create(dto: CreatePurchaseDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException(
        'Purchase must contain at least one product',
      );
    }

    const contact = await this.prisma.contact.findUnique({
      where: {
        id: dto.contactId,
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const productIds = dto.items.map((item) => item.productId);

    const uniqueProductIds = [...new Set(productIds)];

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: uniqueProductIds,
        },
      },

      include: {
        services: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (products.length !== uniqueProductIds.length) {
      throw new BadRequestException('One or more products were not found');
    }

    let subtotal = 0;

    const purchaseItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `${product.name} has only ${product.stock} items in stock`,
        );
      }

      const unitPrice = item.unitPrice ?? Number(product.price);

      const totalPrice = unitPrice * item.quantity;

      subtotal += totalPrice;

      return {
        productId: item.productId,

        quantity: item.quantity,

        unitPrice,

        totalPrice,
      };
    });

    const discount = dto.discount ?? 0;

    const totalAmount = subtotal - discount;

    if (totalAmount < 0) {
      throw new BadRequestException('Purchase total cannot be negative');
    }

    const purchaseDate = dto.purchaseDate
      ? new Date(dto.purchaseDate)
      : new Date();

    const purchaseNumber = this.generatePurchaseNumber();

    const purchase = await this.prisma.$transaction(
      async (tx) => {
        await ensureStockPeriodOpen(tx, purchaseDate);
        const createdPurchase = await tx.purchase.create({
          data: {
            purchaseNumber,

            contactId: dto.contactId,

            purchaseDate,

            subtotal,

            discount,

            totalAmount,

            paymentStatus: dto.paymentStatus,

            notes: dto.notes,

            items: {
              create: purchaseItems,
            },
          },
        });

        for (const item of dto.items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new BadRequestException('Product not found');
          }

          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `${product.name} has only ${product.stock} items in stock`,
            );
          }

          const stockBefore = product.stock;
          const stockAfter = stockBefore - item.quantity;

          await tx.product.update({
            where: {
              id: item.productId,
            },

            data: {
              stock: {
                decrement: item.quantity,
              },
              status:
                stockAfter > 0 ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
            },
          });

          await tx.stockMovement.create({
            data: {
              documentNo: createStockDocumentNumber(StockMovementType.OUTWARD),
              productId: product.id,
              type: StockMovementType.OUTWARD,
              status: StockMovementStatus.DELIVERED,
              quantity: item.quantity,
              stockBefore,
              stockAfter,
              customer: `${contact.firstName} ${contact.lastName}`,
              purpose: StockOutwardPurpose.SALE,
              invoiceNo: purchaseNumber,
              warehouse: 'Main Warehouse',
              occurredAt: purchaseDate,
              notes: `Sale ${purchaseNumber}`,
            },
          });
        }

        for (const item of dto.items) {
          const product = products.find((p) => p.id === item.productId);

          if (!product) {
            continue;
          }

          for (const service of product.services) {
            const scheduledDate = new Date(purchaseDate);

            scheduledDate.setDate(
              scheduledDate.getDate() + service.daysAfterPurchase,
            );

            await tx.customerService.create({
              data: {
                contactId: dto.contactId,

                purchaseId: createdPurchase.id,

                productServiceId: service.id,

                serviceName: service.name,

                scheduledDate,

                status: 'PENDING',
              },
            });
          }
        }

        return createdPurchase;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return this.findById(purchase.id);
  }

  async findAll(params?: {
    contactId?: string;
    search?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) {
    const page = params?.page || 1;

    const limit = params?.limit || 10;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (params?.contactId) {
      where.contactId = params.contactId;
    }

    if (params?.search?.trim()) {
      const search = params.search.trim();
      where.contact = {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (params?.date) {
      const start = new Date(`${params.date}T00:00:00.000Z`);
      const end = new Date(start);
      end.setUTCDate(end.getUTCDate() + 1);
      where.purchaseDate = { gte: start, lt: end };
    }

    const [purchases, total, amount] = await Promise.all([
      this.prisma.purchase.findMany({
        where,

        skip,

        take: limit,

        orderBy: {
          purchaseDate: 'desc',
        },

        include: {
          contact: true,

          items: {
            include: {
              product: true,
            },
          },

          services: {
            orderBy: {
              scheduledDate: 'asc',
            },
          },
        },
      }),

      this.prisma.purchase.count({
        where,
      }),

      this.prisma.purchase.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      success: true,

      data: purchases,

      summary: {
        totalAmount: Number(amount._sum.totalAmount ?? 0),
      },

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: {
        id,
      },

      include: {
        contact: true,

        items: {
          include: {
            product: true,
          },
        },

        services: {
          orderBy: {
            scheduledDate: 'asc',
          },

          include: {
            productService: {
              include: {
                product: true,
              },
            },
          },
        },

        followUps: true,
      },
    });

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return {
      success: true,
      data: purchase,
    };
  }

  async update(id: string, dto: UpdatePurchaseDto) {
    await this.findById(id);

    const purchase = await this.prisma.purchase.update({
      where: {
        id,
      },

      data: dto,
    });

    return {
      success: true,
      data: purchase,
    };
  }

  async remove(id: string) {
    await this.findById(id);

    await this.prisma.purchase.delete({ where: { id } });

    return { success: true, message: 'Purchase deleted successfully' };
  }
}
