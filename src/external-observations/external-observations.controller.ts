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
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ExternalObservationsService } from './external-observations.service';
import { CreateExternalObservationDto } from './dto/create-external-observation.dto';
import { UpdateExternalObservationDto } from './dto/update-external-observation.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ExternalObservation } from './domain/external-observation';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllExternalObservationsDto } from './dto/find-all-external-observations.dto';

import { MapBiomasService } from './mapbiomas.service';

@ApiTags('Externalobservations')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'external-observations',
  version: '1',
})
export class ExternalObservationsController {
  constructor(
    private readonly externalObservationsService: ExternalObservationsService,
    @Inject(forwardRef(() => MapBiomasService))
    private readonly mapBiomasService: MapBiomasService,
  ) {}

  @Post('sync-mapbiomas/:carCode')
  @ApiParam({
    name: 'carCode',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    description:
      'Sincroniza alertas, histórico LULC e métricas de degradação do MapBiomas para o CAR informado.',
  })
  async syncMapBiomas(@Param('carCode') carCode: string) {
    const alerts = await this.mapBiomasService.fetchAlertsByCar(carCode);
    const history = await this.mapBiomasService.fetchLulcHistory(carCode);
    const degradation =
      await this.mapBiomasService.fetchDegradationMetrics(carCode);

    return {
      alerts,
      history,
      degradation,
      message: 'Sincronização com MapBiomas concluída com sucesso.',
    };
  }

  @Get('satellite-imagery')
  @ApiOkResponse({
    description:
      'Retorna a URL de uma imagem de satélite Sentinel-2 real para o ponto.',
  })
  getSatelliteImagery(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
    @Query('date') date?: string,
  ) {
    return this.mapBiomasService.getSatelliteImageryForPoint(
      Number(lat),
      Number(lon),
      date,
    );
  }

  @Post('simulate-satellite/:entityType/:entityId')
  @ApiParam({
    name: 'entityType',
    type: String,
    required: true,
    description: 'Ex: AffectedArea, CollectionPoint',
  })
  @ApiParam({
    name: 'entityId',
    type: String,
    required: true,
  })
  @ApiCreatedResponse({
    type: ExternalObservation,
  })
  simulateSatelliteFetch(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.externalObservationsService.simulateSatelliteFetch(
      entityId,
      entityType,
    );
  }

  @Post()
  @ApiCreatedResponse({
    type: ExternalObservation,
  })
  create(@Body() createExternalObservationDto: CreateExternalObservationDto) {
    return this.externalObservationsService.create(
      createExternalObservationDto,
    );
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(ExternalObservation),
  })
  async findAll(
    @Query() query: FindAllExternalObservationsDto,
  ): Promise<InfinityPaginationResponseDto<ExternalObservation>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.externalObservationsService.findAllWithPagination({
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
    type: ExternalObservation,
  })
  findById(@Param('id') id: string) {
    return this.externalObservationsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: ExternalObservation,
  })
  update(
    @Param('id') id: string,
    @Body() updateExternalObservationDto: UpdateExternalObservationDto,
  ) {
    return this.externalObservationsService.update(
      id,
      updateExternalObservationDto,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.externalObservationsService.remove(id);
  }
}
