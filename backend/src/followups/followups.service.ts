import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateFollowUpDto } from './dto/create-followup.dto';

import { UpdateFollowUpDto } from './dto/update-followup.dto';

@Injectable()
export class FollowupsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private parseScheduledDate(value: string, field: string) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) {
      throw new BadRequestException(`${field} must be a valid date and time`);
    }
    return date;
  }

  async create(
    dto: CreateFollowUpDto,
  ) {
    const contact =
      await this.prisma.contact.findFirst({
        where: {
          id: dto.contactId,
          deletedAt: null,
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

          followUpDate: this.parseScheduledDate(dto.followUpDate, 'followUpDate'),

          reminderDate:
            dto.reminderDate
              ? this.parseScheduledDate(dto.reminderDate, 'reminderDate')
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
    const where: any = {
      deletedAt: null,
      contact: { deletedAt: null },
    };

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
      await this.prisma.purchaseFollowUp.findFirst(
        {
          where: {
            id,
            deletedAt: null,
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
                ? this.parseScheduledDate(dto.followUpDate, 'followUpDate')
                : undefined,

            reminderDate:
              dto.reminderDate
                ? this.parseScheduledDate(dto.reminderDate, 'reminderDate')
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

    await this.prisma.purchaseFollowUp.update(
      {
        where: {
          id,
        },
        data: { deletedAt: new Date() },
      },
    );

    return {
      success: true,

      message:
        'Follow-up archived successfully',
    };
  }
}
