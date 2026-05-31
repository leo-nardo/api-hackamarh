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
import { RestorationPlanVersionsService } from './restoration-plan-versions.service';
import { CreateRestorationPlanVersionDto } from './dto/create-restoration-plan-version.dto';
import { UpdateRestorationPlanVersionDto } from './dto/update-restoration-plan-version.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RestorationPlanVersion } from './domain/restoration-plan-version';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllRestorationPlanVersionsDto } from './dto/find-all-restoration-plan-versions.dto';

@ApiTags('Restorationplanversions')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'restoration-plan-versions',
  version: '1',
})
export class RestorationPlanVersionsController {
  constructor(
    private readonly restorationPlanVersionsService: RestorationPlanVersionsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: RestorationPlanVersion,
  })
  create(
    @Body() createRestorationPlanVersionDto: CreateRestorationPlanVersionDto,
  ) {
    return this.restorationPlanVersionsService.create(
      createRestorationPlanVersionDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(RestorationPlanVersion),
  })
  async findAll(
    @Query() query: FindAllRestorationPlanVersionsDto,
  ): Promise<InfinityPaginationResponseDto<RestorationPlanVersion>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.restorationPlanVersionsService.findAllWithPagination({
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
    type: RestorationPlanVersion,
  })
  findById(@Param('id') id: string) {
    return this.restorationPlanVersionsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: RestorationPlanVersion,
  })
  update(
    @Param('id') id: string,
    @Body() updateRestorationPlanVersionDto: UpdateRestorationPlanVersionDto,
  ) {
    return this.restorationPlanVersionsService.update(
      id,
      updateRestorationPlanVersionDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.restorationPlanVersionsService.remove(id);
  }
}
