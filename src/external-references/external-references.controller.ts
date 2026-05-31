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
import { ExternalReferencesService } from './external-references.service';
import { CreateExternalReferenceDto } from './dto/create-external-reference.dto';
import { UpdateExternalReferenceDto } from './dto/update-external-reference.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ExternalReference } from './domain/external-reference';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllExternalReferencesDto } from './dto/find-all-external-references.dto';

@ApiTags('Externalreferences')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'external-references',
  version: '1',
})
export class ExternalReferencesController {
  constructor(
    private readonly externalReferencesService: ExternalReferencesService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: ExternalReference,
  })
  create(@Body() createExternalReferenceDto: CreateExternalReferenceDto) {
    return this.externalReferencesService.create(createExternalReferenceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ExternalReference),
  })
  async findAll(
    @Query() query: FindAllExternalReferencesDto,
  ): Promise<InfinityPaginationResponseDto<ExternalReference>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.externalReferencesService.findAllWithPagination({
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
    type: ExternalReference,
  })
  findById(@Param('id') id: string) {
    return this.externalReferencesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ExternalReference,
  })
  update(
    @Param('id') id: string,
    @Body() updateExternalReferenceDto: UpdateExternalReferenceDto,
  ) {
    return this.externalReferencesService.update(
      id,
      updateExternalReferenceDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.externalReferencesService.remove(id);
  }
}
