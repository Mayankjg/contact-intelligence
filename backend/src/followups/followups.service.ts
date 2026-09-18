import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFollowUpDto } from './dto/create-followup.dto';

import { UpdateFollowUpDto } from './dto/update-followup.dto';

@Injectable()
export class FollowupsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateFollowUpDto,
  ) {
    const contact =
      await this.prisma.contact.findUnique({
        where: {
          id: dto.contactId,
        },
      });

    if (!contact) {
      throw new NotFoundException(
        'Contact not found',
      );
    }

    const followUp =
      await this.prisma.purchaseFollowUp.create({
        data: {
          contactId:
            dto.contactId,

          title:
            dto.title,

          description:
            dto.description,

          type:
            dto.type ?? 'GENERAL',

          followUpDate:
            new Date(
              dto.followUpDate,
            ),

          reminderDate:
            dto.reminderDate
              ? new Date(
                  dto.reminderDate,
                )
              : undefined,

        },
      });

    return {
      success: true,
      data: followUp,
    };
  }

  async findAll(
    query: any,
  ) {
    const where: any = {};

    if (query.contactId) {
      where.contactId =
        query.contactId;
    }

    if (query.status) {
      where.status =
        query.status;
    }

    if (query.type) {
      where.type =
        query.type;
    }

    const followUps =
      await this.prisma.purchaseFollowUp.findMany(
        {
          where,

          orderBy: {
            followUpDate: 'asc',
          },

          include: {
            contact: true,
          },
        },
      );

    return {
      success: true,
      data: followUps,
    };
  }

  async findById(
    id: string,
  ) {
    const followUp =
      await this.prisma.purchaseFollowUp.findUnique(
        {
          where: {
            id,
          },

          include: {
            contact: true,
          },
        },
      );

    if (!followUp) {
      throw new NotFoundException(
        'Follow-up not found',
      );
    }

    return {
      success: true,
      data: followUp,
    };
  }

  async update(
    id: string,

    dto: UpdateFollowUpDto,
  ) {
    await this.findById(id);

    const followUp =
      await this.prisma.purchaseFollowUp.update(
        {
          where: {
            id,
          },

          data: {
            title:
              dto.title,

            description:
              dto.description,

            type:
              dto.type,

            followUpDate:
              dto.followUpDate
                ? new Date(
                    dto.followUpDate,
                  )
                : undefined,

            reminderDate:
              dto.reminderDate
                ? new Date(
                    dto.reminderDate,
                  )
                : undefined,

            status:
              dto.status,

          },
        },
      );

    return {
      success: true,
      data: followUp,
    };
  }

  async complete(
    id: string,
  ) {
    await this.findById(id);

    const followUp =
      await this.prisma.purchaseFollowUp.update(
        {
          where: {
            id,
          },

          data: {
            status: 'COMPLETED',
          },
        },
      );

    return {
      success: true,
      data: followUp,
    };
  }

  async remove(
    id: string,
  ) {
    await this.findById(id);

    await this.prisma.purchaseFollowUp.delete(
      {
        where: {
          id,
        },
      },
    );

    return {
      success: true,

      message:
        'Follow-up deleted successfully',
    };
  }
}
