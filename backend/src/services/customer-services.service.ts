import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ServiceStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateCustomerServiceDto } from './dto/update-customer-service.dto';
import { CreateCustomerServiceDto } from './dto/create-customer-service.dto';

@Injectable()
export class CustomerServicesService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCustomerServiceDto) {
    const [contact, purchase, template] = await Promise.all([
      this.prisma.contact.findUnique({ where: { id: dto.contactId } }),
      this.prisma.purchase.findUnique({ where: { id: dto.purchaseId } }),
      dto.productServiceId
        ? this.prisma.productService.findUnique({
            where: { id: dto.productServiceId },
          })
        : null,
    ]);

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    if (purchase.contactId !== dto.contactId) {
      throw new BadRequestException(
        'The purchase does not belong to this contact',
      );
    }

    if (dto.productServiceId && !template) {
      throw new NotFoundException('Service template not found');
    }

    const service = await this.prisma.customerService.create({
      data: {
        contactId: dto.contactId,
        purchaseId: dto.purchaseId,
        productServiceId: dto.productServiceId,
        serviceName: dto.serviceName,
        scheduledDate: new Date(dto.scheduledDate),
        status: dto.status ?? 'PENDING',
        notes: dto.notes,
      },
      include: {
        contact: true,
        productService: { include: { product: true } },
      },
    });

    return { success: true, data: service };
  }

  async findAll(query: {
    contactId?: string;
    purchaseId?: string;
    status?: ServiceStatus;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const where = {
      ...(query.contactId && {
        contactId: query.contactId,
      }),
      ...(query.purchaseId && {
        purchaseId: query.purchaseId,
      }),
      ...(query.status && {
        status: query.status,
      }),
    };

    const [services, total] = await Promise.all([
      this.prisma.customerService.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          scheduledDate: 'asc',
        },
        include: {
          contact: true,
          productService: {
            include: {
              product: true,
            },
          },
        },
      }),
      this.prisma.customerService.count({
        where,
      }),
    ]);

    return {
      success: true,
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const service = await this.prisma.customerService.findUnique({
      where: { id },
      include: {
        contact: true,
        productService: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      success: true,
      data: service,
    };
  }

  async update(
    id: string,
    dto: UpdateCustomerServiceDto,
  ) {
    await this.findById(id);

    const service = await this.prisma.customerService.update({
      where: { id },
      data: {
        ...dto,
        scheduledDate: dto.scheduledDate
          ? new Date(dto.scheduledDate)
          : undefined,
        completedDate: dto.completedDate
          ? new Date(dto.completedDate)
          : undefined,
      },
      include: {
        contact: true,
        productService: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      data: service,
    };
  }

  async complete(id: string, notes?: string) {
    await this.findById(id);

    const service = await this.prisma.customerService.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
        notes,
      },
      include: {
        contact: true,
        productService: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      data: service,
    };
  }
}
