import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyEntity } from '../entities/property.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { Property } from '../../../../domain/property';
import { PropertyRepository } from '../../property.repository';
import { PropertyMapper } from '../mappers/property.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PropertyRelationalRepository implements PropertyRepository {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
  ) {}

  async create(data: Property): Promise<Property> {
    const persistenceModel = PropertyMapper.toPersistence(data);
    const newEntity = await this.propertyRepository.save(
      this.propertyRepository.create(persistenceModel),
    );
    return PropertyMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Property[]> {
    const entities = await this.propertyRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PropertyMapper.toDomain(entity));
  }

  async findById(id: Property['id']): Promise<NullableType<Property>> {
    const entity = await this.propertyRepository.findOne({
      where: { id },
    });

    return entity ? PropertyMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Property['id'][]): Promise<Property[]> {
    const entities = await this.propertyRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PropertyMapper.toDomain(entity));
  }

  async update(
    id: Property['id'],
    payload: DeepPartial<Property>,
  ): Promise<Property> {
    const entity = await this.propertyRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.propertyRepository.save(
      this.propertyRepository.create(
        PropertyMapper.toPersistence({
          ...PropertyMapper.toDomain(entity),
          ...payload,
        } as Property),
      ),
    );

    return PropertyMapper.toDomain(updatedEntity);
  }

  async remove(id: Property['id']): Promise<void> {
    await this.propertyRepository.delete(id);
  }
}
