import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MissionEntity } from '../entities/mission.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Mission } from '../../../../domain/mission';
import { MissionRepository } from '../../mission.repository';
import { MissionMapper } from '../mappers/mission.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MissionRelationalRepository implements MissionRepository {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
  ) {}

  async create(data: Mission): Promise<Mission> {
    const persistenceModel = MissionMapper.toPersistence(data);
    const newEntity = await this.missionRepository.save(
      this.missionRepository.create(persistenceModel),
    );
    return MissionMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Mission[]> {
    const entities = await this.missionRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MissionMapper.toDomain(entity));
  }

  async findById(id: Mission['id']): Promise<NullableType<Mission>> {
    const entity = await this.missionRepository.findOne({
      where: { id },
    });

    return entity ? MissionMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Mission['id'][]): Promise<Mission[]> {
    const entities = await this.missionRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => MissionMapper.toDomain(entity));
  }

  async update(id: Mission['id'], payload: Partial<Mission>): Promise<Mission> {
    const entity = await this.missionRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.missionRepository.save(
      this.missionRepository.create(
        MissionMapper.toPersistence({
          ...MissionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MissionMapper.toDomain(updatedEntity);
  }

  async remove(id: Mission['id']): Promise<void> {
    await this.missionRepository.delete(id);
  }
}
