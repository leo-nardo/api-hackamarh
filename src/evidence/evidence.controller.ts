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
import { EvidenceService } from './evidence.service';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Evidence } from './domain/evidence';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEvidenceDto } from './dto/find-all-evidence.dto';

@ApiTags('Evidences')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'evidences',
  version: '1',
})
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @ApiCreatedResponse({
    type: Evidence,
  })
  create(@Body() createEvidenceDto: CreateEvidenceDto) {
    return this.evidenceService.create(createEvidenceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Evidence),
  })
  async findAll(
    @Query() query: FindAllEvidenceDto,
  ): Promise<InfinityPaginationResponseDto<Evidence>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.evidenceService.findAllWithPagination({
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
    type: Evidence,
  })
  findById(@Param('id') id: string) {
    return this.evidenceService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Evidence,
  })
  update(
    @Param('id') id: string,
    @Body() updateEvidenceDto: UpdateEvidenceDto,
  ) {
    return this.evidenceService.update(id, updateEvidenceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.evidenceService.remove(id);
  }
}
