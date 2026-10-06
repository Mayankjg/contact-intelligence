import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateServiceTemplateDto } from './dto/create-service-template.dto';

import { UpdateServiceTemplateDto } from './dto/update-service-template.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async ensureProduct(
    productId: string,
  ) {
    const product =
      await this.prisma.product.findFirst({
        where: {
          id: productId,
          deletedAt: null,
        },
      });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    return product;
  }

  async create(
    productId: string,

    dto: CreateServiceTemplateDto,
  ) {
    await this.ensureProduct(
      productId,
    );

    const service =
      await this.prisma.productService.create(
        {
          data: {
            productId,

            name: dto.name,

            description:
              dto.description,

            daysAfterPurchase:
              dto.daysAfterPurchase,

            durationMinutes:
              dto.durationMinutes,

            isActive:
              dto.isActive ?? true,
          },
        },
      );

    return {
      success: true,
      data: service,
    };
  }

  async findAll(
    productId: string,
  ) {
    await this.ensureProduct(
      productId,
    );

    const services =
      await this.prisma.productService.findMany(
        {
          where: {
            productId,
            deletedAt: null,
          },

          orderBy: {
            daysAfterPurchase:
              'asc',
          },
        },
      );

    return {
      success: true,
      data: services,
    };
  }

  async findOne(
    productId: string,

    serviceId: string,
  ) {
    const service =
      await this.prisma.productService.findFirst(
        {
          where: {
            id: serviceId,
            productId,
            deletedAt: null,
          },
        },
      );

    if (!service) {
      throw new NotFoundException(
        'Service template not found',
      );
    }

    return {
      success: true,
      data: service,
    };
  }

  async update(
    productId: string,

    serviceId: string,

    dto: UpdateServiceTemplateDto,
  ) {
    await this.findOne(
      productId,
      serviceId,
    );

    const service =
      await this.prisma.productService.update(
        {
          where: {
            id: serviceId,
          },

          data: dto,
        },
      );

    return {
      success: true,
      data: service,
    };
  }

  async remove(
    productId: string,

    serviceId: string,
  ) {
    await this.findOne(
      productId,
      serviceId,
    );

    await this.prisma.productService.update(
      {
        where: {
          id: serviceId,
        },
        data: { deletedAt: new Date() },
      },
    );

    return {
      success: true,

      message:
        'Service template archived successfully',
    };
  }
}
