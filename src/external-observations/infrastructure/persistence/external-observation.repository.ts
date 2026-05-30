import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ExternalObservation } from '../../domain/external-observation';

export abstract class ExternalObservationRepository {
  abstract create(
    data: Omit<ExternalObservation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExternalObservation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ExternalObservation[]>;

  abstract findById(
    id: ExternalObservation['id'],
  ): Promise<NullableType<ExternalObservation>>;

  abstract findByIds(
    ids: ExternalObservation['id'][],
  ): Promise<ExternalObservation[]>;

  abstract update(
    id: ExternalObservation['id'],
    payload: DeepPartial<ExternalObservation>,
  ): Promise<ExternalObservation | null>;

  abstract remove(id: ExternalObservation['id']): Promise<void>;
}
