import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Property } from '../../domain/property';

export abstract class PropertyRepository {
  abstract create(
    data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Property>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Property[]>;

  abstract findById(id: Property['id']): Promise<NullableType<Property>>;

  abstract findByIds(ids: Property['id'][]): Promise<Property[]>;

  abstract update(
    id: Property['id'],
    payload: DeepPartial<Property>,
  ): Promise<Property | null>;

  abstract remove(id: Property['id']): Promise<void>;
}
