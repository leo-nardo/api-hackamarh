import { MissionMapper } from '../../../../../missions/infrastructure/persistence/relational/mappers/mission.mapper';
import { Evidence } from '../../../../domain/evidence';
import { EvidenceEntity } from '../entities/evidence.entity';

export class EvidenceMapper {
  static toDomain(raw: EvidenceEntity): Evidence {
    const domainEntity = new Evidence();
    domainEntity.id = raw.id;
    domainEntity.coordenada = raw.coordenada;
    domainEntity.fotoUrl = raw.fotoUrl;
    domainEntity.timestamp = raw.timestamp;
    domainEntity.mortalidadeTaxa = raw.mortalidadeTaxa;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    if (raw.mission) {
      domainEntity.mission = MissionMapper.toDomain(raw.mission);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Evidence): EvidenceEntity {
    const persistenceEntity = new EvidenceEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.coordenada = domainEntity.coordenada;
    persistenceEntity.fotoUrl = domainEntity.fotoUrl;
    persistenceEntity.timestamp = domainEntity.timestamp;
    persistenceEntity.mortalidadeTaxa = domainEntity.mortalidadeTaxa;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    if (domainEntity.mission) {
      persistenceEntity.mission = MissionMapper.toPersistence(
        domainEntity.mission,
      );
    }

    return persistenceEntity;
  }
}
