import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MissionSchedulesService } from './mission-schedules.service';
import { CreateMissionScheduleDto } from './dto/create-mission-schedule.dto';
import { UpdateMissionScheduleDto } from './dto/update-mission-schedule.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MissionSchedule } from './domain/mission-schedule';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMissionSchedulesDto } from './dto/find-all-mission-schedules.dto';

@ApiTags('Missionschedules')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'mission-schedules',
  version: '1',
})
export class MissionSchedulesController {
  constructor(
    private readonly missionSchedulesService: MissionSchedulesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: MissionSchedule,
  })
  create(@Body() createMissionScheduleDto: CreateMissionScheduleDto) {
    return this.missionSchedulesService.create(createMissionScheduleDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(MissionSchedule),
  })
  async findAll(
    @Query() query: FindAllMissionSchedulesDto,
  ): Promise<InfinityPaginationResponseDto<MissionSchedule>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.missionSchedulesService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MissionSchedule,
  })
  findById(@Param('id') id: string) {
    return this.missionSchedulesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: MissionSchedule,
  })
  update(
    @Param('id') id: string,
    @Body() updateMissionScheduleDto: UpdateMissionScheduleDto,
  ) {
    return this.missionSchedulesService.update(id, updateMissionScheduleDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.missionSchedulesService.remove(id);
  }
}
