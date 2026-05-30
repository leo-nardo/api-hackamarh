import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Mission } from '../../domain/mission';

export abstract class MissionRepository {
  abstract create(
    data: Omit<Mission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Mission>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Mission[]>;

  abstract findById(id: Mission['id']): Promise<NullableType<Mission>>;

  abstract findByIds(ids: Mission['id'][]): Promise<Mission[]>;

  abstract update(
    id: Mission['id'],
    payload: DeepPartial<Mission>,
  ): Promise<Mission | null>;

  abstract remove(id: Mission['id']): Promise<void>;
}
