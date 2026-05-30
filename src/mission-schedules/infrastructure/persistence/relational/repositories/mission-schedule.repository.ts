import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MissionScheduleEntity } from '../entities/mission-schedule.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { MissionSchedule } from '../../../../domain/mission-schedule';
import { MissionScheduleRepository } from '../../mission-schedule.repository';
import { MissionScheduleMapper } from '../mappers/mission-schedule.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class MissionScheduleRelationalRepository implements MissionScheduleRepository {
  constructor(
    @InjectRepository(MissionScheduleEntity)
    private readonly missionScheduleRepository: Repository<MissionScheduleEntity>,
  ) {}

  async create(data: MissionSchedule): Promise<MissionSchedule> {
    const persistenceModel = MissionScheduleMapper.toPersistence(data);
    const newEntity = await this.missionScheduleRepository.save(
      this.missionScheduleRepository.create(persistenceModel),
    );
    return MissionScheduleMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<MissionSchedule[]> {
    const entities = await this.missionScheduleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MissionScheduleMapper.toDomain(entity));
  }

  async findById(
    id: MissionSchedule['id'],
  ): Promise<NullableType<MissionSchedule>> {
    const entity = await this.missionScheduleRepository.findOne({
      where: { id },
    });

    return entity ? MissionScheduleMapper.toDomain(entity) : null;
  }

  async findByIds(ids: MissionSchedule['id'][]): Promise<MissionSchedule[]> {
    const entities = await this.missionScheduleRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => MissionScheduleMapper.toDomain(entity));
  }

  async update(
    id: MissionSchedule['id'],
    payload: DeepPartial<MissionSchedule>,
  ): Promise<MissionSchedule> {
    const entity = await this.missionScheduleRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.missionScheduleRepository.save(
      this.missionScheduleRepository.create(
        MissionScheduleMapper.toPersistence({
          ...MissionScheduleMapper.toDomain(entity),
          ...payload,
        } as MissionSchedule),
      ),
    );

    return MissionScheduleMapper.toDomain(updatedEntity);
  }

  async remove(id: MissionSchedule['id']): Promise<void> {
    await this.missionScheduleRepository.delete(id);
  }
}
