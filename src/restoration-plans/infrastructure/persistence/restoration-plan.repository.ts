import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { RestorationPlan } from '../../domain/restoration-plan';

export abstract class RestorationPlanRepository {
  abstract create(
    data: Omit<RestorationPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RestorationPlan>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RestorationPlan[]>;

  abstract findById(
    id: RestorationPlan['id'],
  ): Promise<NullableType<RestorationPlan>>;

  abstract findByIds(ids: RestorationPlan['id'][]): Promise<RestorationPlan[]>;

  abstract update(
    id: RestorationPlan['id'],
    payload: DeepPartial<RestorationPlan>,
  ): Promise<RestorationPlan | null>;

  abstract remove(id: RestorationPlan['id']): Promise<void>;
}
