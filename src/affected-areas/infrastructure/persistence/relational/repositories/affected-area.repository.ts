import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AffectedAreaEntity } from '../entities/affected-area.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { AffectedArea } from '../../../../domain/affected-area';
import { AffectedAreaRepository } from '../../affected-area.repository';
import { AffectedAreaMapper } from '../mappers/affected-area.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AffectedAreaRelationalRepository implements AffectedAreaRepository {
  constructor(
    @InjectRepository(AffectedAreaEntity)
    private readonly affectedAreaRepository: Repository<AffectedAreaEntity>,
  ) {}

  async create(data: AffectedArea): Promise<AffectedArea> {
    const persistenceModel = AffectedAreaMapper.toPersistence(data);
    const newEntity = await this.affectedAreaRepository.save(
      this.affectedAreaRepository.create(persistenceModel),
    );
    return AffectedAreaMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AffectedArea[]> {
    const entities = await this.affectedAreaRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AffectedAreaMapper.toDomain(entity));
  }

  async findById(id: AffectedArea['id']): Promise<NullableType<AffectedArea>> {
    const entity = await this.affectedAreaRepository.findOne({
      where: { id },
    });

    return entity ? AffectedAreaMapper.toDomain(entity) : null;
  }

  async findByIds(ids: AffectedArea['id'][]): Promise<AffectedArea[]> {
    const entities = await this.affectedAreaRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AffectedAreaMapper.toDomain(entity));
  }

  async update(
    id: AffectedArea['id'],
    payload: DeepPartial<AffectedArea>,
  ): Promise<AffectedArea> {
    const entity = await this.affectedAreaRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.affectedAreaRepository.save(
      this.affectedAreaRepository.create(
        AffectedAreaMapper.toPersistence({
          ...AffectedAreaMapper.toDomain(entity),
          ...payload,
        } as AffectedArea),
      ),
    );

    return AffectedAreaMapper.toDomain(updatedEntity);
  }

  async remove(id: AffectedArea['id']): Promise<void> {
    await this.affectedAreaRepository.delete(id);
  }
}
