import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { Mission } from '../../../../domain/mission';
import { MissionEntity } from '../entities/mission.entity';

export class MissionMapper {
  static toDomain(raw: MissionEntity): Mission {
    const domainEntity = new Mission();
    domainEntity.id = raw.id;
    domainEntity.nome = raw.nome;
    domainEntity.codigoCar = raw.codigoCar;
    domainEntity.poligono = raw.poligono;
    domainEntity.status = raw.status;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.tecnico) {
      domainEntity.tecnico = UserMapper.toDomain(raw.tecnico);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Mission): MissionEntity {
    const persistenceEntity = new MissionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.nome = domainEntity.nome;
    persistenceEntity.codigoCar = domainEntity.codigoCar;
    persistenceEntity.poligono = domainEntity.poligono;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.tecnico) {
      persistenceEntity.tecnico = UserMapper.toPersistence(
        domainEntity.tecnico,
      );
    }

    return persistenceEntity;
  }
}
