import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { FollowupsService } from './followups.service';

import { CreateFollowUpDto } from './dto/create-followup.dto';

import { UpdateFollowUpDto } from './dto/update-followup.dto';

@Controller('followups')
export class FollowupsController {
  constructor(
    private readonly followupsService: FollowupsService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateFollowUpDto,
  ) {
    return this.followupsService.create(
      dto,
    );
  }

  @Get()
  findAll(
    @Query()
    query: any,
  ) {
    return this.followupsService.findAll(
      query,
    );
  }

  @Get(':id')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.followupsService.findById(
      id,
    );
  }

  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateFollowUpDto,
  ) {
    return this.followupsService.update(
      id,
      dto,
    );
  }

  @Patch(':id/complete')
  complete(
    @Param('id')
    id: string,
  ) {
    return this.followupsService.complete(
      id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.followupsService.remove(
      id,
    );
  }
}