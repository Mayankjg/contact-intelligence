// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { PrismaService } from '../prisma/prisma.service';

// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { ProductQueryDto } from './dto/product-query.dto';

// @Injectable()
// export class ProductsService {
//   constructor(
//     private readonly prisma: PrismaService,
//   ) {}

//   async create(dto: CreateProductDto) {
//     const existing =
//       await this.prisma.product.findUnique({
//         where: {
//         },
//       });

//     if (existing) {
//       throw new ConflictException(
//       );
//     }

//     const product =
//       await this.prisma.product.create({
//         data: {
//           name: dto.name,
//           description: dto.description,
//           price: dto.price,
//           stock: dto.stock,
//           status: dto.status,
//           category: dto.category,
//         },
//       });

//     return {
//       success: true,
//       data: product,
//     };
//   }

//   async findAll(
//     query: ProductQueryDto,
//   ) {
//     const page = query.page || 1;
//     const limit = query.limit || 10;

//     const skip = (page - 1) * limit;

//     const where: any = {};

//     if (query.status) {
//       where.status = query.status;
//     }

//     if (query.category) {
//       where.category = {
//         contains: query.category,
//         mode: 'insensitive',
//       };
//     }

//     if (query.search) {
//       where.OR = [
//         {
//           name: {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },
//         {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },
//       ];
//     }

//     const [products, total] =
//       await Promise.all([
//         this.prisma.product.findMany({
//           where,
//           skip,
//           take: limit,
//           orderBy: {
//             createdAt: 'desc',
//           },
//         }),

//         this.prisma.product.count({
//           where,
//         }),
//       ]);

//     return {
//       success: true,
//       data: products,
//       meta: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(
//           total / limit,
//         ),
//       },
//     };
//   }

//   async findById(id: string) {
//     const product =
//       await this.prisma.product.findUnique({
//         where: {
//           id,
//         },
//       });

//     if (!product) {
//       throw new NotFoundException(
//         'Product not found',
//       );
//     }

//     return {
//       success: true,
//       data: product,
//     };
//   }

//   async update(
//     id: string,
//     dto: UpdateProductDto,
//   ) {
//     await this.findById(id);

//       const duplicate =
//         await this.prisma.product.findFirst({
//           where: {
//             NOT: {
//               id,
//             },
//           },
//         });

//       if (duplicate) {
//         throw new ConflictException(
//         );
//       }
//     }

//     const product =
//       await this.prisma.product.update({
//         where: {
//           id,
//         },
//         data: dto,
//       });

//     return {
//       success: true,
//       data: product,
//     };
//   }

//   async remove(id: string) {
//     await this.findById(id);

//     const orderItem =
//       await this.prisma.orderItem.findFirst({
//         where: {
//           productId: id,
//         },
//       });

//     if (orderItem) {
//       throw new ConflictException(
//         'This product is already used in an order and cannot be deleted',
//       );
//     }

//     await this.prisma.product.delete({
//       where: {
//         id,
//       },
//     });

//     return {
//       success: true,
//       message: 'Product deleted successfully',
//     };
//   }
// }

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma, StockMovementStatus, StockMovementType } from '@prisma/client';
import { createStockDocumentNumber } from '../stock/stock-number';
import { ensureStockPeriodOpen } from '../stock/stock-period';

import { ProductStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private purchaseDateTime(value?: string) {
    return value
      ? new Date(`${value.slice(0, 10)}T12:00:00.000+05:30`)
      : new Date();
  }

  async create(dto: CreateProductDto) {
    const purchaseDate = this.purchaseDateTime(dto.purchaseDate);

    const product = await this.prisma.$transaction(
      async (tx) => {
        if (dto.stock > 0) await ensureStockPeriodOpen(tx, purchaseDate);
        const created = await tx.product.create({
          data: {
            name: dto.name,
            supplierName: dto.supplierName,
            purchaseDate,
            unitCost: dto.unitCost,
            description: dto.description,
            price: dto.price,
            stock: dto.stock,
            status: dto.status ?? ProductStatus.ACTIVE,
            category: dto.category,
          },
        });
        if (dto.stock > 0) {
          await tx.stockMovement.create({
            data: {
              documentNo: createStockDocumentNumber(StockMovementType.INWARD),
              productId: created.id,
              type: StockMovementType.INWARD,
              status: StockMovementStatus.RECEIVED,
              quantity: dto.stock,
              stockBefore: 0,
              stockAfter: dto.stock,
              supplier: dto.supplierName,
              unitPrice: dto.unitCost,
              warehouse: 'Main Warehouse',
              notes: 'Initial product stock',
              occurredAt: purchaseDate,
            },
          });
        }
        return created;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return {
      success: true,
      data: product,
    };
  }

  async findAll(query: ProductQueryDto) {
    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (query.status) {
      where.status = query.status;
    }

    if (query.category) {
      where.category = {
        contains: query.category,
        mode: 'insensitive',
      };
    }

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          services: { where: { deletedAt: null } },
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      success: true,

      data: products,

      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include: {
        services: {
          where: { deletedAt: null },
          orderBy: {
            daysAfterPurchase: 'asc',
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      data: product,
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const existingResponse = await this.findById(id);

    const existing = existingResponse.data;

    const stockToAdd = dto.stock;
    const { stock: _stock, purchaseDate, ...productData } = dto;
    const stockDate = this.purchaseDateTime(purchaseDate);

    const product = await this.prisma.$transaction(
      async (tx) => {
        if (stockToAdd !== undefined && stockToAdd > 0)
          await ensureStockPeriodOpen(tx, stockDate);
        const current = await tx.product.findUnique({ where: { id } });
        if (!current) throw new NotFoundException('Product not found');
        const updatedStock = current.stock + (stockToAdd ?? 0);
        const updated = await tx.product.update({
          where: {
            id,
          },

          data: {
            ...productData,
            ...(purchaseDate ? { purchaseDate: stockDate } : {}),
            ...(stockToAdd === undefined
              ? {}
              : {
                  stock: {
                    increment: stockToAdd,
                  },
                }),
          },
        });

        if (stockToAdd !== undefined && stockToAdd > 0) {
          await tx.stockMovement.create({
            data: {
              documentNo: createStockDocumentNumber(StockMovementType.INWARD),
              productId: id,
              type: StockMovementType.INWARD,
              status: StockMovementStatus.RECEIVED,
              quantity: stockToAdd,
              stockBefore: current.stock,
              stockAfter: updatedStock,
              supplier: dto.supplierName || current.supplierName || undefined,
              unitPrice: dto.unitCost ?? current.unitCost ?? undefined,
              warehouse: 'Main Warehouse',
              notes: 'Stock added from product form',
              occurredAt: stockDate,
            },
          });
        }
        return updated;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    return {
      success: true,
      data: product,
    };
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.product.update({
      where: {
        id,
      },
      data: { deletedAt: new Date() },
    });

    return {
      success: true,

      message: 'Product archived successfully',
    };
  }
}
