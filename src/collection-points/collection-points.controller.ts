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
import { CollectionPointsService } from './collection-points.service';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { UpdateCollectionPointDto } from './dto/update-collection-point.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CollectionPoint } from './domain/collection-point';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCollectionPointsDto } from './dto/find-all-collection-points.dto';

@ApiTags('Collectionpoints')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'collection-points',
  version: '1',
})
export class CollectionPointsController {
  constructor(
    private readonly collectionPointsService: CollectionPointsService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: CollectionPoint,
  })
  create(@Body() createCollectionPointDto: CreateCollectionPointDto) {
    return this.collectionPointsService.create(createCollectionPointDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(CollectionPoint),
  })
  async findAll(
    @Query() query: FindAllCollectionPointsDto,
  ): Promise<InfinityPaginationResponseDto<CollectionPoint>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.collectionPointsService.findAllWithPagination({
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
    type: CollectionPoint,
  })
  findById(@Param('id') id: string) {
    return this.collectionPointsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: CollectionPoint,
  })
  update(
    @Param('id') id: string,
    @Body() updateCollectionPointDto: UpdateCollectionPointDto,
  ) {
    return this.collectionPointsService.update(id, updateCollectionPointDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.collectionPointsService.remove(id);
  }
}
