import { ExternalReference } from '../../../../domain/external-reference';
import { ExternalReferenceEntity } from '../entities/external-reference.entity';

export class ExternalReferenceMapper {
  static toDomain(raw: ExternalReferenceEntity): ExternalReference {
    const domainEntity = new ExternalReference();
    domainEntity.id = raw.id;
    domainEntity.source = raw.source;
    domainEntity.referenceType = raw.referenceType;
    domainEntity.title = raw.title;
    domainEntity.url = raw.url;
    domainEntity.externalId = raw.externalId;
    domainEntity.entityType = raw.entityType;
    domainEntity.entityId = raw.entityId;
    domainEntity.capturedAt = raw.capturedAt;
    domainEntity.metadataJson = raw.metadataJson;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: ExternalReference,
  ): ExternalReferenceEntity {
    const persistenceEntity = new ExternalReferenceEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.source = domainEntity.source;
    persistenceEntity.referenceType = domainEntity.referenceType;
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.url = domainEntity.url;
    persistenceEntity.externalId = domainEntity.externalId;
    persistenceEntity.entityType = domainEntity.entityType;
    persistenceEntity.entityId = domainEntity.entityId;
    persistenceEntity.capturedAt = domainEntity.capturedAt;
    persistenceEntity.metadataJson = domainEntity.metadataJson;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
