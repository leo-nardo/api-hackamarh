import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EvidenceEntity } from '../entities/evidence.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { Evidence } from '../../../../domain/evidence';
import { EvidenceRepository } from '../../evidence.repository';
import { EvidenceMapper } from '../mappers/evidence.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EvidenceRelationalRepository implements EvidenceRepository {
  constructor(
    @InjectRepository(EvidenceEntity)
    private readonly evidenceRepository: Repository<EvidenceEntity>,
  ) {}

  async create(data: Evidence): Promise<Evidence> {
    const persistenceModel = EvidenceMapper.toPersistence(data);
    const newEntity = await this.evidenceRepository.save(
      this.evidenceRepository.create(persistenceModel),
    );
    return EvidenceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Evidence[]> {
    const entities = await this.evidenceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => EvidenceMapper.toDomain(entity));
  }

  async findById(id: Evidence['id']): Promise<NullableType<Evidence>> {
    const entity = await this.evidenceRepository.findOne({
      where: { id },
    });

    return entity ? EvidenceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Evidence['id'][]): Promise<Evidence[]> {
    const entities = await this.evidenceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => EvidenceMapper.toDomain(entity));
  }

  async update(
    id: Evidence['id'],
    payload: DeepPartial<Evidence>,
  ): Promise<Evidence> {
    const entity = await this.evidenceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.evidenceRepository.save(
      this.evidenceRepository.create(
        EvidenceMapper.toPersistence({
          ...EvidenceMapper.toDomain(entity),
          ...payload,
        } as Evidence),
      ),
    );

    return EvidenceMapper.toDomain(updatedEntity);
  }

  async remove(id: Evidence['id']): Promise<void> {
    await this.evidenceRepository.delete(id);
  }
}
