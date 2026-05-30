import { Property } from '../../../../domain/property';
import { PropertyEntity } from '../entities/property.entity';

export class PropertyMapper {
  static toDomain(raw: PropertyEntity): Property {
    const domainEntity = new Property();
    domainEntity.id = raw.id;
    domainEntity.carCode = raw.carCode;
    domainEntity.name = raw.name;
    domainEntity.ownerName = raw.ownerName;
    domainEntity.ownerDocument = raw.ownerDocument;
    domainEntity.municipality = raw.municipality;
    domainEntity.state = raw.state;
    domainEntity.totalAreaHa = raw.totalAreaHa;
    domainEntity.geom = raw.geom;
    domainEntity.source = raw.source;
    domainEntity.externalCode = raw.externalCode;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Property): PropertyEntity {
    const persistenceEntity = new PropertyEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.carCode = domainEntity.carCode;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.ownerName = domainEntity.ownerName;
    persistenceEntity.ownerDocument = domainEntity.ownerDocument;
    persistenceEntity.municipality = domainEntity.municipality;
    persistenceEntity.state = domainEntity.state;
    persistenceEntity.totalAreaHa = domainEntity.totalAreaHa;
    persistenceEntity.geom = domainEntity.geom;
    persistenceEntity.source = domainEntity.source;
    persistenceEntity.externalCode = domainEntity.externalCode;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
