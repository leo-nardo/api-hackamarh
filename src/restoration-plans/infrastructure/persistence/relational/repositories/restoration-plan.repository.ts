import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RestorationPlanEntity } from '../entities/restoration-plan.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { RestorationPlan } from '../../../../domain/restoration-plan';
import { RestorationPlanRepository } from '../../restoration-plan.repository';
import { RestorationPlanMapper } from '../mappers/restoration-plan.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class RestorationPlanRelationalRepository implements RestorationPlanRepository {
  constructor(
    @InjectRepository(RestorationPlanEntity)
    private readonly restorationPlanRepository: Repository<RestorationPlanEntity>,
  ) {}

  async create(data: RestorationPlan): Promise<RestorationPlan> {
    const persistenceModel = RestorationPlanMapper.toPersistence(data);
    const newEntity = await this.restorationPlanRepository.save(
      this.restorationPlanRepository.create(persistenceModel),
    );
    return RestorationPlanMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RestorationPlan[]> {
    const entities = await this.restorationPlanRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => RestorationPlanMapper.toDomain(entity));
  }

  async findById(
    id: RestorationPlan['id'],
  ): Promise<NullableType<RestorationPlan>> {
    const entity = await this.restorationPlanRepository.findOne({
      where: { id },
    });

    return entity ? RestorationPlanMapper.toDomain(entity) : null;
  }

  async findByIds(ids: RestorationPlan['id'][]): Promise<RestorationPlan[]> {
    const entities = await this.restorationPlanRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => RestorationPlanMapper.toDomain(entity));
  }

  async update(
    id: RestorationPlan['id'],
    payload: DeepPartial<RestorationPlan>,
  ): Promise<RestorationPlan> {
    const entity = await this.restorationPlanRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.restorationPlanRepository.save(
      this.restorationPlanRepository.create(
        RestorationPlanMapper.toPersistence({
          ...RestorationPlanMapper.toDomain(entity),
          ...payload,
        } as RestorationPlan),
      ),
    );

    return RestorationPlanMapper.toDomain(updatedEntity);
  }

  async remove(id: RestorationPlan['id']): Promise<void> {
    await this.restorationPlanRepository.delete(id);
  }
}
