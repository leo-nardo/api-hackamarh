import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { AffectedAreaMapper } from '../../../../../affected-areas/infrastructure/persistence/relational/mappers/affected-area.mapper';
import { Mission } from '../../../../domain/mission';
import { MissionEntity } from '../entities/mission.entity';

export class MissionMapper {
  static toDomain(raw: MissionEntity): Mission {
    const domainEntity = new Mission();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.objective = raw.objective;
    domainEntity.status = raw.status;
    domainEntity.priority = raw.priority;
    domainEntity.dueDate = raw.dueDate;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.affectedArea) {
      domainEntity.affectedArea = AffectedAreaMapper.toDomain(raw.affectedArea);
    }

    if (raw.assignedTo) {
      domainEntity.assignedTo = UserMapper.toDomain(raw.assignedTo);
    }

    if (raw.createdBy) {
      domainEntity.createdBy = UserMapper.toDomain(raw.createdBy);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Mission): MissionEntity {
    const persistenceEntity = new MissionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    persistenceEntity.objective = domainEntity.objective;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.priority = domainEntity.priority;
    persistenceEntity.dueDate = domainEntity.dueDate;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.affectedArea) {
      persistenceEntity.affectedArea = AffectedAreaMapper.toPersistence(
        domainEntity.affectedArea,
      );
    }

    if (domainEntity.assignedTo) {
      persistenceEntity.assignedTo = UserMapper.toPersistence(
        domainEntity.assignedTo,
      );
    }

    if (domainEntity.createdBy) {
      persistenceEntity.createdBy = UserMapper.toPersistence(
        domainEntity.createdBy,
      );
    }

    return persistenceEntity;
  }
}
