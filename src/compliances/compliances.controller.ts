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
import { CompliancesService } from './compliances.service';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Compliance } from './domain/compliance';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCompliancesDto } from './dto/find-all-compliances.dto';

@ApiTags('Compliances')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'compliances',
  version: '1',
})
export class CompliancesController {
  constructor(private readonly compliancesService: CompliancesService) {}

  @Get('recovery-analysis/:carCode')
  @ApiParam({
    name: 'carCode',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description:
      'Retorna o dataset completo de análise de recuperação no formato esperado pelo Frontend.',
  })
  getRecoveryAnalysis(@Param('carCode') carCode: string) {
    return this.compliancesService.getRecoveryAnalysis(carCode);
  }

  @Get('audit-summary/:carCode')
  @ApiParam({
    name: 'carCode',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    description:
      'Retorna um resumo de auditoria cruzando dados de satélite e campo.',
  })
  getAuditSummary(@Param('carCode') carCode: string) {
    return this.compliancesService.getAuditSummary(carCode);
  }

  @Post()
  @ApiCreatedResponse({
    type: Compliance,
  })
  create(@Body() createComplianceDto: CreateComplianceDto) {
    return this.compliancesService.create(createComplianceDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Compliance),
  })
  async findAll(
    @Query() query: FindAllCompliancesDto,
  ): Promise<InfinityPaginationResponseDto<Compliance>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.compliancesService.findAllWithPagination({
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
    type: Compliance,
  })
  findById(@Param('id') id: string) {
    return this.compliancesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Compliance,
  })
  update(
    @Param('id') id: string,
    @Body() updateComplianceDto: UpdateComplianceDto,
  ) {
    return this.compliancesService.update(id, updateComplianceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.compliancesService.remove(id);
  }
}
