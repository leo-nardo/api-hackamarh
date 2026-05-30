import { MissionSchedule } from '../../../../domain/mission-schedule';
import { MissionMapper } from '../../../../../missions/infrastructure/persistence/relational/mappers/mission.mapper';
import { MissionScheduleEntity } from '../entities/mission-schedule.entity';

export class MissionScheduleMapper {
  static toDomain(raw: MissionScheduleEntity): MissionSchedule {
    const domainEntity = new MissionSchedule();
    domainEntity.id = raw.id;
    domainEntity.startsAt = raw.startsAt;
    domainEntity.endsAt = raw.endsAt;
    domainEntity.deadlineAt = raw.deadlineAt;
    domainEntity.recurrenceRule = raw.recurrenceRule;
    domainEntity.status = raw.status;
    domainEntity.notes = raw.notes;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.mission) {
      domainEntity.mission = MissionMapper.toDomain(raw.mission);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: MissionSchedule): MissionScheduleEntity {
    const persistenceEntity = new MissionScheduleEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.startsAt = domainEntity.startsAt;
    persistenceEntity.endsAt = domainEntity.endsAt;
    persistenceEntity.deadlineAt = domainEntity.deadlineAt;
    persistenceEntity.recurrenceRule = domainEntity.recurrenceRule;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.notes = domainEntity.notes;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.mission) {
      persistenceEntity.mission = MissionMapper.toPersistence(
        domainEntity.mission,
      );
    }

    return persistenceEntity;
  }
}
