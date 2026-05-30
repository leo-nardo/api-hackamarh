import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CollectionPointEntity } from '../entities/collection-point.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { CollectionPoint } from '../../../../domain/collection-point';
import { CollectionPointRepository } from '../../collection-point.repository';
import { CollectionPointMapper } from '../mappers/collection-point.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class CollectionPointRelationalRepository implements CollectionPointRepository {
  constructor(
    @InjectRepository(CollectionPointEntity)
    private readonly collectionPointRepository: Repository<CollectionPointEntity>,
  ) {}

  async create(data: CollectionPoint): Promise<CollectionPoint> {
    const persistenceModel = CollectionPointMapper.toPersistence(data);
    const newEntity = await this.collectionPointRepository.save(
      this.collectionPointRepository.create(persistenceModel),
    );
    return CollectionPointMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CollectionPoint[]> {
    const entities = await this.collectionPointRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => CollectionPointMapper.toDomain(entity));
  }

  async findById(
    id: CollectionPoint['id'],
  ): Promise<NullableType<CollectionPoint>> {
    const entity = await this.collectionPointRepository.findOne({
      where: { id },
    });

    return entity ? CollectionPointMapper.toDomain(entity) : null;
  }

  async findByIds(ids: CollectionPoint['id'][]): Promise<CollectionPoint[]> {
    const entities = await this.collectionPointRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => CollectionPointMapper.toDomain(entity));
  }

  async update(
    id: CollectionPoint['id'],
    payload: DeepPartial<CollectionPoint>,
  ): Promise<CollectionPoint> {
    const entity = await this.collectionPointRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.collectionPointRepository.save(
      this.collectionPointRepository.create(
        CollectionPointMapper.toPersistence({
          ...CollectionPointMapper.toDomain(entity),
          ...payload,
        } as CollectionPoint),
      ),
    );

    return CollectionPointMapper.toDomain(updatedEntity);
  }

  async remove(id: CollectionPoint['id']): Promise<void> {
    await this.collectionPointRepository.delete(id);
  }
}
