import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateExternalObservationDto } from './dto/create-external-observation.dto';
import { UpdateExternalObservationDto } from './dto/update-external-observation.dto';
import { ExternalObservationRepository } from './infrastructure/persistence/external-observation.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ExternalObservation } from './domain/external-observation';
import { DeepPartial } from '../utils/types/deep-partial.type';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExternalObservationsService {
  constructor(
    // Dependencies here
    private readonly externalObservationRepository: ExternalObservationRepository,
  ) {}

  async simulateSatelliteFetch(entityId: string, entityType: string) {
    // MOCK: Simula a chamada a uma API de Satélite (Ex: Planet, Sentinel, MapBiomas)
    // Na vida real, usaríamos o polígono da entidade (ex: AffectedArea) para buscar a imagem recortada.

    // Gera uma data aleatória nos últimos 30 dias
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    const simulatedObservation: ExternalObservation = {
      id: uuidv4(),
      source: 'sentinel-2-mock',
      observationType: 'satellite_image',
      entityType: entityType,
      entityId: entityId,
      observedAt: date,
      metrics: {
        ndvi: 0.45, // Índice de Vegetação (0 a 1)
        cloudCover: 12.5, // % de nuvens
        resolutionMeters: 10,
        imageUrl: 'https://cdn.esa.int/sentinel2/mock_image_forest.jpg', // URL real viria da API
      },
      confidenceScore: 0.95,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.externalObservationRepository.create(simulatedObservation);
  }

  async create(createExternalObservationDto: CreateExternalObservationDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.externalObservationRepository.create({
      source: createExternalObservationDto.source,
      observationType: createExternalObservationDto.observationType,
      entityType: createExternalObservationDto.entityType,
      entityId: createExternalObservationDto.entityId,
      observedAt: createExternalObservationDto.observedAt,
      periodStart: createExternalObservationDto.periodStart,
      periodEnd: createExternalObservationDto.periodEnd,
      queryParams: createExternalObservationDto.queryParams,
      metrics: createExternalObservationDto.metrics,
      geom: createExternalObservationDto.geom,
      rawPayload: createExternalObservationDto.rawPayload,
      confidenceScore: createExternalObservationDto.confidenceScore,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.externalObservationRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: ExternalObservation['id']) {
    return this.externalObservationRepository.findById(id);
  }

  findByIds(ids: ExternalObservation['id'][]) {
    return this.externalObservationRepository.findByIds(ids);
  }

  async update(
    id: ExternalObservation['id'],
    updateExternalObservationDto: UpdateExternalObservationDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.externalObservationRepository.update(id, {
      source: updateExternalObservationDto.source,
      observationType: updateExternalObservationDto.observationType,
      entityType: updateExternalObservationDto.entityType,
      entityId: updateExternalObservationDto.entityId,
      observedAt: updateExternalObservationDto.observedAt,
      periodStart: updateExternalObservationDto.periodStart,
      periodEnd: updateExternalObservationDto.periodEnd,
      queryParams: updateExternalObservationDto.queryParams,
      metrics: updateExternalObservationDto.metrics,
      geom: updateExternalObservationDto.geom,
      rawPayload: updateExternalObservationDto.rawPayload,
      confidenceScore: updateExternalObservationDto.confidenceScore,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<ExternalObservation>);
  }

  remove(id: ExternalObservation['id']) {
    return this.externalObservationRepository.remove(id);
  }
}
