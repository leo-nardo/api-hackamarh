import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExternalObservationEntity } from '../entities/external-observation.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { ExternalObservation } from '../../../../domain/external-observation';
import { ExternalObservationRepository } from '../../external-observation.repository';
import { ExternalObservationMapper } from '../mappers/external-observation.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ExternalObservationRelationalRepository implements ExternalObservationRepository {
  constructor(
    @InjectRepository(ExternalObservationEntity)
    private readonly externalObservationRepository: Repository<ExternalObservationEntity>,
  ) {}

  async create(data: ExternalObservation): Promise<ExternalObservation> {
    const persistenceModel = ExternalObservationMapper.toPersistence(data);
    const newEntity = await this.externalObservationRepository.save(
      this.externalObservationRepository.create(persistenceModel),
    );
    return ExternalObservationMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ExternalObservation[]> {
    const entities = await this.externalObservationRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ExternalObservationMapper.toDomain(entity));
  }

  async findById(
    id: ExternalObservation['id'],
  ): Promise<NullableType<ExternalObservation>> {
    const entity = await this.externalObservationRepository.findOne({
      where: { id },
    });

    return entity ? ExternalObservationMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: ExternalObservation['id'][],
  ): Promise<ExternalObservation[]> {
    const entities = await this.externalObservationRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ExternalObservationMapper.toDomain(entity));
  }

  async update(
    id: ExternalObservation['id'],
    payload: DeepPartial<ExternalObservation>,
  ): Promise<ExternalObservation> {
    const entity = await this.externalObservationRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.externalObservationRepository.save(
      this.externalObservationRepository.create(
        ExternalObservationMapper.toPersistence({
          ...ExternalObservationMapper.toDomain(entity),
          ...payload,
        } as ExternalObservation),
      ),
    );

    return ExternalObservationMapper.toDomain(updatedEntity);
  }

  async remove(id: ExternalObservation['id']): Promise<void> {
    await this.externalObservationRepository.delete(id);
  }
}
