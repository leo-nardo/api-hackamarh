import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateMissionScheduleDto } from './dto/create-mission-schedule.dto';
import { UpdateMissionScheduleDto } from './dto/update-mission-schedule.dto';
import { MissionScheduleRepository } from './infrastructure/persistence/mission-schedule.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { MissionSchedule } from './domain/mission-schedule';
import { Mission } from '../missions/domain/mission';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class MissionSchedulesService {
  constructor(
    // Dependencies here
    private readonly missionScheduleRepository: MissionScheduleRepository,
  ) {}

  async create(createMissionScheduleDto: CreateMissionScheduleDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.missionScheduleRepository.create({
      mission: { id: createMissionScheduleDto.mission.id } as Mission,
      startsAt: createMissionScheduleDto.startsAt,
      endsAt: createMissionScheduleDto.endsAt,
      deadlineAt: createMissionScheduleDto.deadlineAt,
      recurrenceRule: createMissionScheduleDto.recurrenceRule,
      status: createMissionScheduleDto.status ?? 'scheduled',
      notes: createMissionScheduleDto.notes,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.missionScheduleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: MissionSchedule['id']) {
    return this.missionScheduleRepository.findById(id);
  }

  findByIds(ids: MissionSchedule['id'][]) {
    return this.missionScheduleRepository.findByIds(ids);
  }

  async update(
    id: MissionSchedule['id'],
    updateMissionScheduleDto: UpdateMissionScheduleDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.missionScheduleRepository.update(id, {
      mission: updateMissionScheduleDto.mission
        ? ({ id: updateMissionScheduleDto.mission.id } as Mission)
        : undefined,
      startsAt: updateMissionScheduleDto.startsAt,
      endsAt: updateMissionScheduleDto.endsAt,
      deadlineAt: updateMissionScheduleDto.deadlineAt,
      recurrenceRule: updateMissionScheduleDto.recurrenceRule,
      status: updateMissionScheduleDto.status,
      notes: updateMissionScheduleDto.notes,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<MissionSchedule>);
  }

  remove(id: MissionSchedule['id']) {
    return this.missionScheduleRepository.remove(id);
  }
}
