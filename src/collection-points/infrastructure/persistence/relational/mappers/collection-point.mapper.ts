import { CollectionPoint } from '../../../../domain/collection-point';
import { AffectedAreaMapper } from '../../../../../affected-areas/infrastructure/persistence/relational/mappers/affected-area.mapper';
import { CollectionPointEntity } from '../entities/collection-point.entity';

export class CollectionPointMapper {
  static toDomain(raw: CollectionPointEntity): CollectionPoint {
    const domainEntity = new CollectionPoint();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.pointType = raw.pointType;
    domainEntity.location = raw.location;
    domainEntity.radiusMeters = raw.radiusMeters;
    domainEntity.requiredPhotoCount = raw.requiredPhotoCount;
    domainEntity.instructions = raw.instructions;
    domainEntity.sortOrder = raw.sortOrder;
    domainEntity.isActive = raw.isActive;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.affectedArea) {
      domainEntity.affectedArea = AffectedAreaMapper.toDomain(raw.affectedArea);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: CollectionPoint): CollectionPointEntity {
    const persistenceEntity = new CollectionPointEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.pointType = domainEntity.pointType;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.radiusMeters = domainEntity.radiusMeters;
    persistenceEntity.requiredPhotoCount = domainEntity.requiredPhotoCount;
    persistenceEntity.instructions = domainEntity.instructions;
    persistenceEntity.sortOrder = domainEntity.sortOrder;
    persistenceEntity.isActive = domainEntity.isActive;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.affectedArea) {
      persistenceEntity.affectedArea = AffectedAreaMapper.toPersistence(
        domainEntity.affectedArea,
      );
    }

    return persistenceEntity;
  }
}
