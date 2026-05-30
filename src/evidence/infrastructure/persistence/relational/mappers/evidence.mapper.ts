import { CollectionPointMapper } from '../../../../../collection-points/infrastructure/persistence/relational/mappers/collection-point.mapper';
import { MissionMapper } from '../../../../../missions/infrastructure/persistence/relational/mappers/mission.mapper';
import { PropertyMapper } from '../../../../../properties/infrastructure/persistence/relational/mappers/property.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Evidence } from '../../../../domain/evidence';
import { EvidenceEntity } from '../entities/evidence.entity';

export class EvidenceMapper {
  static toDomain(raw: EvidenceEntity): Evidence {
    const domainEntity = new Evidence();
    domainEntity.id = raw.id;
    domainEntity.status = raw.status;
    domainEntity.location = raw.location;
    domainEntity.altitude = raw.altitude;
    domainEntity.fotoUrl = raw.fotoUrl;
    domainEntity.capturedAt = raw.capturedAt;
    domainEntity.submittedAt = raw.submittedAt;
    domainEntity.deviceModel = raw.deviceModel;
    domainEntity.mortalityRate = raw.mortalityRate;
    domainEntity.faseSucessional = raw.faseSucessional;
    domainEntity.metodoRestauracao = raw.metodoRestauracao;
    domainEntity.notes = raw.notes;
    domainEntity.validationReason = raw.validationReason;
    domainEntity.validatedAt = raw.validatedAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.mission) {
      domainEntity.mission = MissionMapper.toDomain(raw.mission);
    }

    if (raw.property) {
      domainEntity.property = PropertyMapper.toDomain(raw.property);
    }

    if (raw.collectionPoint) {
      domainEntity.collectionPoint = CollectionPointMapper.toDomain(
        raw.collectionPoint,
      );
    }

    if (raw.technician) {
      domainEntity.technician = UserMapper.toDomain(raw.technician);
    }

    if (raw.validatedBy) {
      domainEntity.validatedBy = UserMapper.toDomain(raw.validatedBy);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Evidence): EvidenceEntity {
    const persistenceEntity = new EvidenceEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.status = domainEntity.status;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.altitude = domainEntity.altitude;
    persistenceEntity.fotoUrl = domainEntity.fotoUrl;
    persistenceEntity.capturedAt = domainEntity.capturedAt;
    persistenceEntity.submittedAt = domainEntity.submittedAt;
    persistenceEntity.deviceModel = domainEntity.deviceModel;
    persistenceEntity.mortalityRate = domainEntity.mortalityRate;
    persistenceEntity.faseSucessional = domainEntity.faseSucessional;
    persistenceEntity.metodoRestauracao = domainEntity.metodoRestauracao;
    persistenceEntity.notes = domainEntity.notes;
    persistenceEntity.validationReason = domainEntity.validationReason;
    persistenceEntity.validatedAt = domainEntity.validatedAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.mission) {
      persistenceEntity.mission = MissionMapper.toPersistence(
        domainEntity.mission,
      );
    }

    if (domainEntity.property) {
      persistenceEntity.property = PropertyMapper.toPersistence(
        domainEntity.property,
      );
    }

    if (domainEntity.collectionPoint) {
      persistenceEntity.collectionPoint = CollectionPointMapper.toPersistence(
        domainEntity.collectionPoint,
      );
    }

    if (domainEntity.technician) {
      persistenceEntity.technician = UserMapper.toPersistence(
        domainEntity.technician,
      );
    }

    if (domainEntity.validatedBy) {
      persistenceEntity.validatedBy = UserMapper.toPersistence(
        domainEntity.validatedBy,
      );
    }

    return persistenceEntity;
  }
}
