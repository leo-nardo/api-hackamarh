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
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Mission } from './domain/mission';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllMissionsDto } from './dto/find-all-missions.dto';

@ApiTags('Missions')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'missions',
  version: '1',
})
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Mission,
  })
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(createMissionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Mission),
  })
  async findAll(
    @Query() query: FindAllMissionsDto,
  ): Promise<InfinityPaginationResponseDto<Mission>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.missionsService.findAllWithPagination({
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
    type: Mission,
  })
  findById(@Param('id') id: string) {
    return this.missionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Mission,
  })
  update(@Param('id') id: string, @Body() updateMissionDto: UpdateMissionDto) {
    return this.missionsService.update(id, updateMissionDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.missionsService.remove(id);
  }
}
