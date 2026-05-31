import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Compliance } from '../../domain/compliance';

export abstract class ComplianceRepository {
  abstract create(
    data: Omit<Compliance, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Compliance>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Compliance[]>;

  abstract findById(id: Compliance['id']): Promise<NullableType<Compliance>>;

  abstract findByIds(ids: Compliance['id'][]): Promise<Compliance[]>;

  abstract update(
    id: Compliance['id'],
    payload: DeepPartial<Compliance>,
  ): Promise<Compliance | null>;

  abstract remove(id: Compliance['id']): Promise<void>;
}
