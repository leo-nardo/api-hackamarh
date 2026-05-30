import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ExternalReference } from '../../domain/external-reference';

export abstract class ExternalReferenceRepository {
  abstract create(
    data: Omit<ExternalReference, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExternalReference>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ExternalReference[]>;

  abstract findById(
    id: ExternalReference['id'],
  ): Promise<NullableType<ExternalReference>>;

  abstract findByIds(
    ids: ExternalReference['id'][],
  ): Promise<ExternalReference[]>;

  abstract update(
    id: ExternalReference['id'],
    payload: DeepPartial<ExternalReference>,
  ): Promise<ExternalReference | null>;

  abstract remove(id: ExternalReference['id']): Promise<void>;
}
