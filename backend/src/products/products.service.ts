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
//           sku: dto.sku,
//         },
//       });

//     if (existing) {
//       throw new ConflictException(
//         'Product SKU already exists',
//       );
//     }

//     const product =
//       await this.prisma.product.create({
//         data: {
//           name: dto.name,
//           sku: dto.sku,
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
//           sku: {
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

//     if (dto.sku) {
//       const duplicate =
//         await this.prisma.product.findFirst({
//           where: {
//             sku: dto.sku,
//             NOT: {
//               id,
//             },
//           },
//         });

//       if (duplicate) {
//         throw new ConflictException(
//           'Product SKU already exists',
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
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateProductDto,
  ) {
    const existing =
      await this.prisma.product.findUnique({
        where: {
          sku: dto.sku,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Product SKU already exists',
      );
    }

    const product =
      await this.prisma.product.create({
        data: {
          name: dto.name,
          sku: dto.sku,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          status: dto.status,
          category: dto.category,
        },
      });

    return {
      success: true,
      data: product,
    };
  }

  async findAll(
    query: ProductQueryDto,
  ) {
    const page =
      query.page || 1;

    const limit =
      query.limit || 10;

    const skip =
      (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status =
        query.status;
    }

    if (query.category) {
      where.category = {
        contains:
          query.category,
        mode: 'insensitive',
      };
    }

    if (query.search) {
      where.OR = [
        {
          name: {
            contains:
              query.search,
            mode: 'insensitive',
          },
        },
        {
          sku: {
            contains:
              query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [
      products,
      total,
    ] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          services: true,
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
        totalPages:
          Math.ceil(
            total / limit,
          ),
      },
    };
  }

  async findById(
    id: string,
  ) {
    const product =
      await this.prisma.product.findUnique({
        where: {
          id,
        },

        include: {
          services: {
            orderBy: {
              daysAfterPurchase:
                'asc',
            },
          },
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return {
      success: true,
      data: product,
    };
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ) {
    await this.findById(id);

    if (dto.sku) {
      const duplicate =
        await this.prisma.product.findFirst({
          where: {
            sku: dto.sku,

            NOT: {
              id,
            },
          },
        });

      if (duplicate) {
        throw new ConflictException(
          'Product SKU already exists',
        );
      }
    }

    const product =
      await this.prisma.product.update({
        where: {
          id,
        },

        data: dto,
      });

    return {
      success: true,
      data: product,
    };
  }

  async remove(
    id: string,
  ) {
    await this.findById(id);

    const purchaseItem =
      await this.prisma.purchaseItem.findFirst({
        where: {
          productId: id,
        },
      });

    if (purchaseItem) {
      throw new ConflictException(
        'Product is already used in a purchase and cannot be deleted',
      );
    }

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return {
      success: true,

      message:
        'Product deleted successfully',
    };
  }
}
