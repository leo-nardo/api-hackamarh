import { AffectedArea } from '../../../../domain/affected-area';
import { PropertyMapper } from '../../../../../properties/infrastructure/persistence/relational/mappers/property.mapper';
import { RestorationPlanVersionMapper } from '../../../../../restoration-plan-versions/infrastructure/persistence/relational/mappers/restoration-plan-version.mapper';
import { AffectedAreaEntity } from '../entities/affected-area.entity';

export class AffectedAreaMapper {
  static toDomain(raw: AffectedAreaEntity): AffectedArea {
    const domainEntity = new AffectedArea();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.areaType = raw.areaType;
    domainEntity.status = raw.status;
    domainEntity.geom = raw.geom;
    domainEntity.areaHa = raw.areaHa;
    domainEntity.priority = raw.priority;
    domainEntity.notes = raw.notes;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.property) {
      domainEntity.property = PropertyMapper.toDomain(raw.property);
    }

    if (raw.restorationPlanVersion) {
      domainEntity.restorationPlanVersion =
        RestorationPlanVersionMapper.toDomain(raw.restorationPlanVersion);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: AffectedArea): AffectedAreaEntity {
    const persistenceEntity = new AffectedAreaEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.areaType = domainEntity.areaType;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.geom = domainEntity.geom;
    persistenceEntity.areaHa = domainEntity.areaHa;
    persistenceEntity.priority = domainEntity.priority;
    persistenceEntity.notes = domainEntity.notes;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.property) {
      persistenceEntity.property = PropertyMapper.toPersistence(
        domainEntity.property,
      );
    }

    if (domainEntity.restorationPlanVersion) {
      persistenceEntity.restorationPlanVersion =
        RestorationPlanVersionMapper.toPersistence(
          domainEntity.restorationPlanVersion,
        );
    }

    return persistenceEntity;
  }
}
