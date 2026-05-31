import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Evidence } from '../../domain/evidence';

export abstract class EvidenceRepository {
  abstract create(
    data: Omit<Evidence, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Evidence>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Evidence[]>;

  abstract findById(id: Evidence['id']): Promise<NullableType<Evidence>>;

  abstract findByIds(ids: Evidence['id'][]): Promise<Evidence[]>;

  abstract update(
    id: Evidence['id'],
    payload: DeepPartial<Evidence>,
  ): Promise<Evidence | null>;

  abstract remove(id: Evidence['id']): Promise<void>;

  abstract executeRawQuery(query: string, parameters?: any[]): Promise<any>;
}
