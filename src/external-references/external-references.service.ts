import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateExternalReferenceDto } from './dto/create-external-reference.dto';
import { UpdateExternalReferenceDto } from './dto/update-external-reference.dto';
import { ExternalReferenceRepository } from './infrastructure/persistence/external-reference.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { ExternalReference } from './domain/external-reference';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class ExternalReferencesService {
  constructor(
    // Dependencies here
    private readonly externalReferenceRepository: ExternalReferenceRepository,
  ) {}

  async create(createExternalReferenceDto: CreateExternalReferenceDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.externalReferenceRepository.create({
      source: createExternalReferenceDto.source,
      referenceType: createExternalReferenceDto.referenceType,
      title: createExternalReferenceDto.title,
      url: createExternalReferenceDto.url,
      externalId: createExternalReferenceDto.externalId,
      entityType: createExternalReferenceDto.entityType,
      entityId: createExternalReferenceDto.entityId,
      capturedAt: createExternalReferenceDto.capturedAt,
      metadataJson: createExternalReferenceDto.metadataJson,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.externalReferenceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: ExternalReference['id']) {
    return this.externalReferenceRepository.findById(id);
  }

  findByIds(ids: ExternalReference['id'][]) {
    return this.externalReferenceRepository.findByIds(ids);
  }

  async update(
    id: ExternalReference['id'],
    updateExternalReferenceDto: UpdateExternalReferenceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.externalReferenceRepository.update(id, {
      source: updateExternalReferenceDto.source,
      referenceType: updateExternalReferenceDto.referenceType,
      title: updateExternalReferenceDto.title,
      url: updateExternalReferenceDto.url,
      externalId: updateExternalReferenceDto.externalId,
      entityType: updateExternalReferenceDto.entityType,
      entityId: updateExternalReferenceDto.entityId,
      capturedAt: updateExternalReferenceDto.capturedAt,
      metadataJson: updateExternalReferenceDto.metadataJson,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<ExternalReference>);
  }

  remove(id: ExternalReference['id']) {
    return this.externalReferenceRepository.remove(id);
  }
}
