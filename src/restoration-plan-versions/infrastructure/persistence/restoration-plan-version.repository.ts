import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { RestorationPlanVersion } from '../../domain/restoration-plan-version';

export abstract class RestorationPlanVersionRepository {
  abstract create(
    data: Omit<RestorationPlanVersion, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RestorationPlanVersion>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<RestorationPlanVersion[]>;

  abstract findById(
    id: RestorationPlanVersion['id'],
  ): Promise<NullableType<RestorationPlanVersion>>;

  abstract findByIds(
    ids: RestorationPlanVersion['id'][],
  ): Promise<RestorationPlanVersion[]>;

  abstract update(
    id: RestorationPlanVersion['id'],
    payload: DeepPartial<RestorationPlanVersion>,
  ): Promise<RestorationPlanVersion | null>;

  abstract remove(id: RestorationPlanVersion['id']): Promise<void>;
}
