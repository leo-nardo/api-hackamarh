import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExternalReferenceEntity } from '../entities/external-reference.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { ExternalReference } from '../../../../domain/external-reference';
import { ExternalReferenceRepository } from '../../external-reference.repository';
import { ExternalReferenceMapper } from '../mappers/external-reference.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ExternalReferenceRelationalRepository implements ExternalReferenceRepository {
  constructor(
    @InjectRepository(ExternalReferenceEntity)
    private readonly externalReferenceRepository: Repository<ExternalReferenceEntity>,
  ) {}

  async create(data: ExternalReference): Promise<ExternalReference> {
    const persistenceModel = ExternalReferenceMapper.toPersistence(data);
    const newEntity = await this.externalReferenceRepository.save(
      this.externalReferenceRepository.create(persistenceModel),
    );
    return ExternalReferenceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ExternalReference[]> {
    const entities = await this.externalReferenceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ExternalReferenceMapper.toDomain(entity));
  }

  async findById(
    id: ExternalReference['id'],
  ): Promise<NullableType<ExternalReference>> {
    const entity = await this.externalReferenceRepository.findOne({
      where: { id },
    });

    return entity ? ExternalReferenceMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: ExternalReference['id'][],
  ): Promise<ExternalReference[]> {
    const entities = await this.externalReferenceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ExternalReferenceMapper.toDomain(entity));
  }

  async update(
    id: ExternalReference['id'],
    payload: DeepPartial<ExternalReference>,
  ): Promise<ExternalReference> {
    const entity = await this.externalReferenceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.externalReferenceRepository.save(
      this.externalReferenceRepository.create(
        ExternalReferenceMapper.toPersistence({
          ...ExternalReferenceMapper.toDomain(entity),
          ...payload,
        } as ExternalReference),
      ),
    );

    return ExternalReferenceMapper.toDomain(updatedEntity);
  }

  async remove(id: ExternalReference['id']): Promise<void> {
    await this.externalReferenceRepository.delete(id);
  }
}
