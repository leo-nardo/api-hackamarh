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
import { AffectedAreasService } from './affected-areas.service';
import { CreateAffectedAreaDto } from './dto/create-affected-area.dto';
import { UpdateAffectedAreaDto } from './dto/update-affected-area.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AffectedArea } from './domain/affected-area';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAffectedAreasDto } from './dto/find-all-affected-areas.dto';

@ApiTags('Affectedareas')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'affected-areas',
  version: '1',
})
export class AffectedAreasController {
  constructor(private readonly affectedAreasService: AffectedAreasService) {}

  @Post()
  @ApiCreatedResponse({
    type: AffectedArea,
  })
  create(@Body() createAffectedAreaDto: CreateAffectedAreaDto) {
    return this.affectedAreasService.create(createAffectedAreaDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(AffectedArea),
  })
  async findAll(
    @Query() query: FindAllAffectedAreasDto,
  ): Promise<InfinityPaginationResponseDto<AffectedArea>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.affectedAreasService.findAllWithPagination({
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
    type: AffectedArea,
  })
  findById(@Param('id') id: string) {
    return this.affectedAreasService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: AffectedArea,
  })
  update(
    @Param('id') id: string,
    @Body() updateAffectedAreaDto: UpdateAffectedAreaDto,
  ) {
    return this.affectedAreasService.update(id, updateAffectedAreaDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.affectedAreasService.remove(id);
  }
}
