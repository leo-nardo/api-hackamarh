import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { AffectedArea } from '../../domain/affected-area';

export abstract class AffectedAreaRepository {
  abstract create(
    data: Omit<AffectedArea, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AffectedArea>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AffectedArea[]>;

  abstract findById(
    id: AffectedArea['id'],
  ): Promise<NullableType<AffectedArea>>;

  abstract findByIds(ids: AffectedArea['id'][]): Promise<AffectedArea[]>;

  abstract update(
    id: AffectedArea['id'],
    payload: DeepPartial<AffectedArea>,
  ): Promise<AffectedArea | null>;

  abstract remove(id: AffectedArea['id']): Promise<void>;
}
