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

@Injectable()
export class ExternalObservationsService {
  constructor(
    // Dependencies here
    private readonly externalObservationRepository: ExternalObservationRepository,
  ) {}

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
