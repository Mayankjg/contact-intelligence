import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductStatus, StockMovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementQueryDto } from './dto/stock-movement-query.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovement(dto: CreateStockMovementDto) {
    if (dto.type === StockMovementType.OUTWARD && !dto.notes?.trim()) {
      throw new BadRequestException('A reason is required for outward stock movement');
    }

    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const product = await tx.product.findUnique({
              where: { id: dto.productId },
            });

            if (!product) {
              throw new NotFoundException('Product not found');
            }

            if (dto.type === StockMovementType.OUTWARD && product.stock < dto.quantity) {
              throw new BadRequestException(
                `Only ${product.stock} units are currently in stock`,
              );
            }

            const stockBefore = product.stock;
            const stockAfter = dto.type === StockMovementType.INWARD
              ? stockBefore + dto.quantity
              : stockBefore - dto.quantity;

            const updatedProduct = await tx.product.update({
              where: { id: product.id },
              data: {
                stock: dto.type === StockMovementType.INWARD
                  ? { increment: dto.quantity }
                  : { decrement: dto.quantity },
                status: stockAfter > 0 ? ProductStatus.ACTIVE : ProductStatus.INACTIVE,
              },
            });

            const movement = await tx.stockMovement.create({
              data: {
                productId: product.id,
                type: dto.type,
                quantity: dto.quantity,
                stockBefore,
                stockAfter,
                notes: dto.notes?.trim() || undefined,
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
        const retryable = error instanceof Prisma.PrismaClientKnownRequestError
          && error.code === 'P2034';
        if (retryable && attempt < 2) continue;
        throw error;
      }
    }

    throw new BadRequestException('Stock changed during this request. Please try again.');
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
        orderBy: { createdAt: 'desc' },
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
}
