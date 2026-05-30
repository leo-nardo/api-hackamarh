import { PropertyUser } from '../../../../domain/property-user';
import { PropertyMapper } from '../../../../../properties/infrastructure/persistence/relational/mappers/property.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { PropertyUserEntity } from '../entities/property-user.entity';

export class PropertyUserMapper {
  static toDomain(raw: PropertyUserEntity): PropertyUser {
    const domainEntity = new PropertyUser();
    domainEntity.id = raw.id;
    domainEntity.role = raw.role;
    domainEntity.canSubmitEvidence = raw.canSubmitEvidence;
    domainEntity.canManageProperty = raw.canManageProperty;
    domainEntity.startsAt = raw.startsAt;
    domainEntity.endsAt = raw.endsAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.property) {
      domainEntity.property = PropertyMapper.toDomain(raw.property);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: PropertyUser): PropertyUserEntity {
    const persistenceEntity = new PropertyUserEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.canSubmitEvidence = domainEntity.canSubmitEvidence;
    persistenceEntity.canManageProperty = domainEntity.canManageProperty;
    persistenceEntity.startsAt = domainEntity.startsAt;
    persistenceEntity.endsAt = domainEntity.endsAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.property) {
      persistenceEntity.property = PropertyMapper.toPersistence(
        domainEntity.property,
      );
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    return persistenceEntity;
  }
}
