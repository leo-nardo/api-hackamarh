import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ComplianceEntity } from '../entities/compliance.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Compliance } from '../../../../domain/compliance';
import { ComplianceRepository } from '../../compliance.repository';
import { ComplianceMapper } from '../mappers/compliance.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ComplianceRelationalRepository implements ComplianceRepository {
  constructor(
    @InjectRepository(ComplianceEntity)
    private readonly complianceRepository: Repository<ComplianceEntity>,
  ) {}

  async create(data: Compliance): Promise<Compliance> {
    const persistenceModel = ComplianceMapper.toPersistence(data);
    const newEntity = await this.complianceRepository.save(
      this.complianceRepository.create(persistenceModel),
    );
    return ComplianceMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Compliance[]> {
    const entities = await this.complianceRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ComplianceMapper.toDomain(entity));
  }

  async findById(id: Compliance['id']): Promise<NullableType<Compliance>> {
    const entity = await this.complianceRepository.findOne({
      where: { id },
    });

    return entity ? ComplianceMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Compliance['id'][]): Promise<Compliance[]> {
    const entities = await this.complianceRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ComplianceMapper.toDomain(entity));
  }

  async update(
    id: Compliance['id'],
    payload: Partial<Compliance>,
  ): Promise<Compliance> {
    const entity = await this.complianceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.complianceRepository.save(
      this.complianceRepository.create(
        ComplianceMapper.toPersistence({
          ...ComplianceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ComplianceMapper.toDomain(updatedEntity);
  }

  async remove(id: Compliance['id']): Promise<void> {
    await this.complianceRepository.delete(id);
  }
}
