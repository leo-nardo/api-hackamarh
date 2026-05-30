import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { PropertyUser } from '../../domain/property-user';

export abstract class PropertyUserRepository {
  abstract create(
    data: Omit<PropertyUser, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PropertyUser>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PropertyUser[]>;

  abstract findById(
    id: PropertyUser['id'],
  ): Promise<NullableType<PropertyUser>>;

  abstract findByIds(ids: PropertyUser['id'][]): Promise<PropertyUser[]>;

  abstract update(
    id: PropertyUser['id'],
    payload: DeepPartial<PropertyUser>,
  ): Promise<PropertyUser | null>;

  abstract remove(id: PropertyUser['id']): Promise<void>;
}
