import { RestorationPlan } from '../../../../domain/restoration-plan';
import { PropertyMapper } from '../../../../../properties/infrastructure/persistence/relational/mappers/property.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { RestorationPlanEntity } from '../entities/restoration-plan.entity';

export class RestorationPlanMapper {
  static toDomain(raw: RestorationPlanEntity): RestorationPlan {
    const domainEntity = new RestorationPlan();
    domainEntity.id = raw.id;
    domainEntity.title = raw.title;
    domainEntity.status = raw.status;
    domainEntity.planType = raw.planType;
    domainEntity.currentVersionId = raw.currentVersionId;
    domainEntity.approvedAt = raw.approvedAt;
    domainEntity.notes = raw.notes;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.property) {
      domainEntity.property = PropertyMapper.toDomain(raw.property);
    }

    if (raw.createdBy) {
      domainEntity.createdBy = UserMapper.toDomain(raw.createdBy);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: RestorationPlan): RestorationPlanEntity {
    const persistenceEntity = new RestorationPlanEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.planType = domainEntity.planType;
    persistenceEntity.currentVersionId = domainEntity.currentVersionId;
    persistenceEntity.approvedAt = domainEntity.approvedAt;
    persistenceEntity.notes = domainEntity.notes;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.property) {
      persistenceEntity.property = PropertyMapper.toPersistence(
        domainEntity.property,
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
