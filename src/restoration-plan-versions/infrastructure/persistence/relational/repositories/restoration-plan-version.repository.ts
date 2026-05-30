import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RestorationPlanVersionEntity } from '../entities/restoration-plan-version.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { RestorationPlanVersion } from '../../../../domain/restoration-plan-version';
import { RestorationPlanVersionRepository } from '../../restoration-plan-version.repository';
import { RestorationPlanVersionMapper } from '../mappers/restoration-plan-version.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class RestorationPlanVersionRelationalRepository implements RestorationPlanVersionRepository {
  constructor(
    @InjectRepository(RestorationPlanVersionEntity)
    private readonly restorationPlanVersionRepository: Repository<RestorationPlanVersionEntity>,
  ) {}

  async create(data: RestorationPlanVersion): Promise<RestorationPlanVersion> {
    const persistenceModel = RestorationPlanVersionMapper.toPersistence(data);
    const newEntity = await this.restorationPlanVersionRepository.save(
      this.restorationPlanVersionRepository.create(persistenceModel),
    );
    return RestorationPlanVersionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RestorationPlanVersion[]> {
    const entities = await this.restorationPlanVersionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) =>
      RestorationPlanVersionMapper.toDomain(entity),
    );
  }

  async findById(
    id: RestorationPlanVersion['id'],
  ): Promise<NullableType<RestorationPlanVersion>> {
    const entity = await this.restorationPlanVersionRepository.findOne({
      where: { id },
    });

    return entity ? RestorationPlanVersionMapper.toDomain(entity) : null;
  }

  async findByIds(
    ids: RestorationPlanVersion['id'][],
  ): Promise<RestorationPlanVersion[]> {
    const entities = await this.restorationPlanVersionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) =>
      RestorationPlanVersionMapper.toDomain(entity),
    );
  }

  async update(
    id: RestorationPlanVersion['id'],
    payload: DeepPartial<RestorationPlanVersion>,
  ): Promise<RestorationPlanVersion> {
    const entity = await this.restorationPlanVersionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.restorationPlanVersionRepository.save(
      this.restorationPlanVersionRepository.create(
        RestorationPlanVersionMapper.toPersistence({
          ...RestorationPlanVersionMapper.toDomain(entity),
          ...payload,
        } as RestorationPlanVersion),
      ),
    );

    return RestorationPlanVersionMapper.toDomain(updatedEntity);
  }

  async remove(id: RestorationPlanVersion['id']): Promise<void> {
    await this.restorationPlanVersionRepository.delete(id);
  }
}
