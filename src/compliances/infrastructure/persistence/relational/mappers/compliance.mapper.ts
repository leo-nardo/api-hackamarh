import { Compliance } from '../../../../domain/compliance';
import { ComplianceEntity } from '../entities/compliance.entity';

export class ComplianceMapper {
  static toDomain(raw: ComplianceEntity): Compliance {
    const domainEntity = new Compliance();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Compliance): ComplianceEntity {
    const persistenceEntity = new ComplianceEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
