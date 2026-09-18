// import {
//   ConflictException,
//   Injectable,
//   NotFoundException,
// } from '@nestjs/common';

// import { PrismaService } from '../prisma/prisma.service';

// import { CreateContactDto } from './dto/create-contact.dto';
// import { UpdateContactDto } from './dto/update-contact.dto';
// import { ContactQueryDto } from './dto/contact-query.dto';
// import { Prisma } from '@prisma/client';

// @Injectable()
// export class ContactsService {
//   constructor(private readonly prisma: PrismaService) {}

//   // CREATE
//   async create(dto: CreateContactDto) {
//     const existingContact = await this.prisma.contact.findFirst({
//       where: {
//         phone: dto.phone,
//       },
//     });

//     if (existingContact) {
//       throw new ConflictException(
//         'A contact with this phone number already exists',
//       );
//     }

//     if (dto.email) {
//       const existingEmail = await this.prisma.contact.findFirst({
//         where: {
//           email: dto.email,
//         },
//       });

//       if (existingEmail) {
//         throw new ConflictException('A contact with this email already exists');
//       }
//     }

//     const contact = await this.prisma.contact.create({
//       data: {
//         firstName: dto.firstName,
//         lastName: dto.lastName,
//         phone: dto.phone,
//         email: dto.email,
//         alternatePhone: dto.alternatePhone,
//         company: dto.company,
//         customerType: dto.customerType,
//         status: dto.status,
//         address: dto.address,
//         city: dto.city,
//         state: dto.state,
//         country: dto.country,
//         postalCode: dto.postalCode,
//         notes: dto.notes,
//         ownerId: dto.ownerId,
//       },

//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return {
//       success: true,
//       data: contact,
//     };
//   }

//   // GET ALL
//   async findAll(query: ContactQueryDto) {
//     const page = query.page || 1;
//     const limit = query.limit || 10;

//     const skip = (page - 1) * limit;

//     const where: Prisma.ContactWhereInput = {};

//     if (query.status) {
//       where.status = query.status;
//     }

//     if (query.search) {
//       where.OR = [
//         {
//           firstName: {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },

//         {
//           lastName: {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },

//         {
//           phone: {
//             contains: query.search,
//           },
//         },

//         {
//           email: {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },

//         {
//           company: {
//             contains: query.search,
//             mode: 'insensitive',
//           },
//         },
//       ];
//     }

//     const [contacts, total] = await Promise.all([
//       this.prisma.contact.findMany({
//         where,

//         skip,

//         take: limit,

//         orderBy: {
//           createdAt: 'desc',
//         },

//         include: {
//           owner: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               email: true,
//             },
//           },
//         },
//       }),

//       this.prisma.contact.count({
//         where,
//       }),
//     ]);

//     return {
//       success: true,

//       data: contacts,

//       meta: {
//         total,

//         page,

//         limit,

//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   }

//   // GET BY ID
//   async findById(id: string) {
//     const contact = await this.prisma.contact.findUnique({
//       where: {
//         id,
//       },

//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!contact) {
//       throw new NotFoundException('Contact not found');
//     }

//     return {
//       success: true,
//       data: contact,
//     };
//   }

//   // SEARCH BY PHONE
//   async searchByPhone(phone: string) {
//     if (!phone) {
//       throw new NotFoundException('Phone number is required');
//     }

//     const contact = await this.prisma.contact.findFirst({
//       where: {
//         phone: {
//           contains: phone,
//         },
//       },

//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!contact) {
//       throw new NotFoundException('No contact found with this phone number');
//     }

//     return {
//       success: true,
//       data: contact,
//     };
//   }

//   // UPDATE
//   async update(id: string, dto: UpdateContactDto) {
//     await this.findById(id);

//     if (dto.phone) {
//       const duplicate = await this.prisma.contact.findFirst({
//         where: {
//           phone: dto.phone,

//           NOT: {
//             id,
//           },
//         },
//       });

//       if (duplicate) {
//         throw new ConflictException(
//           'Another contact already uses this phone number',
//         );
//       }
//     }

//     if (dto.email) {
//       const duplicate = await this.prisma.contact.findFirst({
//         where: {
//           email: dto.email,

//           NOT: {
//             id,
//           },
//         },
//       });

//       if (duplicate) {
//         throw new ConflictException('Another contact already uses this email');
//       }
//     }

//     const updated = await this.prisma.contact.update({
//       where: {
//         id,
//       },

//       data: {
//         ...dto,
//       },

//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     return {
//       success: true,
//       data: updated,
//     };
//   }

//   // DELETE
//   async remove(id: string) {
//     await this.findById(id);

//     await this.prisma.contact.delete({
//       where: {
//         id,
//       },
//     });

//     return {
//       success: true,
//       message: 'Contact deleted successfully',
//     };
//   }
// }




import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactQueryDto } from './dto/contact-query.dto';

@Injectable()
export class ContactsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateContactDto) {
    const existing =
      await this.prisma.contact.findFirst({
        where: {
          phone: dto.phone,
        },
      });

    if (existing) {
      throw new ConflictException(
        'Contact with this phone number already exists',
      );
    }

    const contact =
      await this.prisma.contact.create({
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          email: dto.email,
          alternatePhone:
            dto.alternatePhone,
          company: dto.company,
          customerType:
            dto.customerType,
          status: dto.status,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          country: dto.country,
          postalCode:
            dto.postalCode,
          notes: dto.notes,
          ownerId: dto.ownerId,
        },
      });

    return {
      success: true,
      data: contact,
    };
  }

  async findAll(query: ContactQueryDto) {
    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        {
          firstName: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          lastName: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          phone: {
            contains: query.search,
          },
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          company: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [contacts, total] =
      await Promise.all([
        this.prisma.contact.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),

        this.prisma.contact.count({
          where,
        }),
      ]);

    return {
      success: true,
      data: contacts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async findById(id: string) {
    const contact =
      await this.prisma.contact.findUnique({
        where: {
          id,
        },
      });

    if (!contact) {
      throw new NotFoundException(
        'Contact not found',
      );
    }

    return {
      success: true,
      data: contact,
    };
  }

  async searchByPhone(phone: string) {
    const contact =
      await this.prisma.contact.findFirst({
        where: {
          phone: {
            contains: phone,
          },
        },
      });

    if (!contact) {
      throw new NotFoundException(
        'Contact not found',
      );
    }

    return {
      success: true,
      data: contact,
    };
  }

  async getDetails(id: string) {
    const contact =
      await this.prisma.contact.findUnique({
        where: {
          id,
        },

        include: {
          owner: true,

          purchases: {
            orderBy: {
              purchaseDate: 'desc',
            },

            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          },

          services: {
            orderBy: {
              scheduledDate: 'asc',
            },

            include: {
              purchase: true,
              productService: {
                include: {
                  product: true,
                },
              },
            },
          },

          followUps: {
            orderBy: {
              followUpDate: 'asc',
            },
          },
        },
      });

    if (!contact) {
      throw new NotFoundException(
        'Contact not found',
      );
    }

    const upcomingServices =
      contact.services.filter(
        (service) =>
          service.status !==
            'COMPLETED' &&
          service.status !==
            'CANCELLED',
      );

    const completedServices =
      contact.services.filter(
        (service) =>
          service.status ===
          'COMPLETED',
      );

    const pendingFollowUps =
      contact.followUps.filter(
        (followUp) =>
          followUp.status ===
          'PENDING',
      );

    const totalProducts =
      contact.purchases.reduce(
        (total, purchase) =>
          total +
          purchase.items.reduce(
            (itemTotal, item) =>
              itemTotal +
              item.quantity,
            0,
          ),
        0,
      );

    const timeline = [
      ...contact.purchases.map(
        (purchase) => ({
          type: 'PURCHASE',
          date:
            purchase.purchaseDate,
          title: `Purchase ${purchase.purchaseNumber}`,
          description:
            purchase.items
              .map(
                (item) =>
                  `${item.product.name} x${item.quantity}`,
              )
              .join(', '),
          referenceId:
            purchase.id,
        }),
      ),

      ...contact.services.map(
        (service) => ({
          type: 'SERVICE',
          date:
            service.scheduledDate,
          title:
            service.serviceName,
          description:
            service.status,
          referenceId:
            service.id,
        }),
      ),

      ...contact.followUps.map(
        (followUp) => ({
          type: 'FOLLOW_UP',
          date:
            followUp.followUpDate,
          title:
            followUp.title,
          description:
            followUp.description,
          referenceId:
            followUp.id,
        }),
      ),
    ].sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime(),
    );

    return {
      success: true,

      data: {
        contact,

        summary: {
          totalPurchases:
            contact.purchases.length,

          totalProducts,

          upcomingServices:
            upcomingServices.length,

          completedServices:
            completedServices.length,

          pendingFollowUps:
            pendingFollowUps.length,
        },

        purchases:
          contact.purchases,

        upcomingServices,

        completedServices,

        followUps:
          contact.followUps,

        timeline,
      },
    };
  }

  async update(
    id: string,
    dto: UpdateContactDto,
  ) {
    await this.findById(id);

    if (dto.phone) {
      const duplicate =
        await this.prisma.contact.findFirst({
          where: {
            phone: dto.phone,
            NOT: {
              id,
            },
          },
        });

      if (duplicate) {
        throw new ConflictException(
          'Contact with this phone number already exists',
        );
      }
    }

    const contact =
      await this.prisma.contact.update({
        where: {
          id,
        },

        data: dto,
      });

    return {
      success: true,
      data: contact,
    };
  }

  async remove(id: string) {
    await this.findById(id);

    await this.prisma.contact.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message:
        'Contact deleted successfully',
    };
  }
}