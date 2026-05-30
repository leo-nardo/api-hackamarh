import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { CollectionPoint } from '../../domain/collection-point';

export abstract class CollectionPointRepository {
  abstract create(
    data: Omit<CollectionPoint, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CollectionPoint>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<CollectionPoint[]>;

  abstract findById(
    id: CollectionPoint['id'],
  ): Promise<NullableType<CollectionPoint>>;

  abstract findByIds(ids: CollectionPoint['id'][]): Promise<CollectionPoint[]>;

  abstract update(
    id: CollectionPoint['id'],
    payload: DeepPartial<CollectionPoint>,
  ): Promise<CollectionPoint | null>;

  abstract remove(id: CollectionPoint['id']): Promise<void>;
}
