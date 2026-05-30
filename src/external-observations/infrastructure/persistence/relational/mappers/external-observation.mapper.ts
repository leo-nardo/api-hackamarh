import { ExternalObservation } from '../../../../domain/external-observation';
import { ExternalObservationEntity } from '../entities/external-observation.entity';

export class ExternalObservationMapper {
  static toDomain(raw: ExternalObservationEntity): ExternalObservation {
    const domainEntity = new ExternalObservation();
    domainEntity.id = raw.id;
    domainEntity.source = raw.source;
    domainEntity.observationType = raw.observationType;
    domainEntity.entityType = raw.entityType;
    domainEntity.entityId = raw.entityId;
    domainEntity.observedAt = raw.observedAt;
    domainEntity.periodStart = raw.periodStart;
    domainEntity.periodEnd = raw.periodEnd;
    domainEntity.queryParams = raw.queryParams;
    domainEntity.metrics = raw.metrics;
    domainEntity.geom = raw.geom;
    domainEntity.rawPayload = raw.rawPayload;
    domainEntity.confidenceScore = raw.confidenceScore;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: ExternalObservation,
  ): ExternalObservationEntity {
    const persistenceEntity = new ExternalObservationEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.source = domainEntity.source;
    persistenceEntity.observationType = domainEntity.observationType;
    persistenceEntity.entityType = domainEntity.entityType;
    persistenceEntity.entityId = domainEntity.entityId;
    persistenceEntity.observedAt = domainEntity.observedAt;
    persistenceEntity.periodStart = domainEntity.periodStart;
    persistenceEntity.periodEnd = domainEntity.periodEnd;
    persistenceEntity.queryParams = domainEntity.queryParams;
    persistenceEntity.metrics = domainEntity.metrics;
    persistenceEntity.geom = domainEntity.geom;
    persistenceEntity.rawPayload = domainEntity.rawPayload;
    persistenceEntity.confidenceScore = domainEntity.confidenceScore;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
