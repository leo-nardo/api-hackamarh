import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { MissionSchedule } from '../../domain/mission-schedule';

export abstract class MissionScheduleRepository {
  abstract create(
    data: Omit<MissionSchedule, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<MissionSchedule>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MissionSchedule[]>;

  abstract findById(
    id: MissionSchedule['id'],
  ): Promise<NullableType<MissionSchedule>>;

  abstract findByIds(ids: MissionSchedule['id'][]): Promise<MissionSchedule[]>;

  abstract update(
    id: MissionSchedule['id'],
    payload: DeepPartial<MissionSchedule>,
  ): Promise<MissionSchedule | null>;

  abstract remove(id: MissionSchedule['id']): Promise<void>;
}
