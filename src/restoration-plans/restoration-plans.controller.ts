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
import { RestorationPlansService } from './restoration-plans.service';
import { CreateRestorationPlanDto } from './dto/create-restoration-plan.dto';
import { UpdateRestorationPlanDto } from './dto/update-restoration-plan.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RestorationPlan } from './domain/restoration-plan';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllRestorationPlansDto } from './dto/find-all-restoration-plans.dto';

@ApiTags('Restorationplans')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'restoration-plans',
  version: '1',
})
export class RestorationPlansController {
  constructor(
    private readonly restorationPlansService: RestorationPlansService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: RestorationPlan,
  })
  create(@Body() createRestorationPlanDto: CreateRestorationPlanDto) {
    return this.restorationPlansService.create(createRestorationPlanDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(RestorationPlan),
  })
  async findAll(
    @Query() query: FindAllRestorationPlansDto,
  ): Promise<InfinityPaginationResponseDto<RestorationPlan>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.restorationPlansService.findAllWithPagination({
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
    type: RestorationPlan,
  })
  findById(@Param('id') id: string) {
    return this.restorationPlansService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: RestorationPlan,
  })
  update(
    @Param('id') id: string,
    @Body() updateRestorationPlanDto: UpdateRestorationPlanDto,
  ) {
    return this.restorationPlansService.update(id, updateRestorationPlanDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.restorationPlansService.remove(id);
  }
}
