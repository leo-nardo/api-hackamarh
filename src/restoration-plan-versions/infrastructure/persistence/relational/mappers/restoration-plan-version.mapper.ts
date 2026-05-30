import { RestorationPlanVersion } from '../../../../domain/restoration-plan-version';
import { RestorationPlanMapper } from '../../../../../restoration-plans/infrastructure/persistence/relational/mappers/restoration-plan.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { RestorationPlanVersionEntity } from '../entities/restoration-plan-version.entity';

export class RestorationPlanVersionMapper {
  static toDomain(raw: RestorationPlanVersionEntity): RestorationPlanVersion {
    const domainEntity = new RestorationPlanVersion();
    domainEntity.id = raw.id;
    domainEntity.versionNumber = raw.versionNumber;
    domainEntity.source = raw.source;
    domainEntity.status = raw.status;
    domainEntity.documentUrl = raw.documentUrl;
    domainEntity.summary = raw.summary;
    domainEntity.contentJson = raw.contentJson;
    domainEntity.submittedAt = raw.submittedAt;
    domainEntity.approvedAt = raw.approvedAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.restorationPlan) {
      domainEntity.restorationPlan = RestorationPlanMapper.toDomain(
        raw.restorationPlan,
      );
    }

    if (raw.proposedBy) {
      domainEntity.proposedBy = UserMapper.toDomain(raw.proposedBy);
    }

    return domainEntity;
  }

  static toPersistence(
    domainEntity: RestorationPlanVersion,
  ): RestorationPlanVersionEntity {
    const persistenceEntity = new RestorationPlanVersionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.versionNumber = domainEntity.versionNumber;
    persistenceEntity.source = domainEntity.source;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.documentUrl = domainEntity.documentUrl;
    persistenceEntity.summary = domainEntity.summary;
    persistenceEntity.contentJson = domainEntity.contentJson;
    persistenceEntity.submittedAt = domainEntity.submittedAt;
    persistenceEntity.approvedAt = domainEntity.approvedAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.restorationPlan) {
      persistenceEntity.restorationPlan = RestorationPlanMapper.toPersistence(
        domainEntity.restorationPlan,
      );
    }

    if (domainEntity.proposedBy) {
      persistenceEntity.proposedBy = UserMapper.toPersistence(
        domainEntity.proposedBy,
      );
    }

    return persistenceEntity;
  }
}
