import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PropertyUserEntity } from '../entities/property-user.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { DeepPartial } from '../../../../../utils/types/deep-partial.type';
import { PropertyUser } from '../../../../domain/property-user';
import { PropertyUserRepository } from '../../property-user.repository';
import { PropertyUserMapper } from '../mappers/property-user.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class PropertyUserRelationalRepository implements PropertyUserRepository {
  constructor(
    @InjectRepository(PropertyUserEntity)
    private readonly propertyUserRepository: Repository<PropertyUserEntity>,
  ) {}

  async create(data: PropertyUser): Promise<PropertyUser> {
    const persistenceModel = PropertyUserMapper.toPersistence(data);
    const newEntity = await this.propertyUserRepository.save(
      this.propertyUserRepository.create(persistenceModel),
    );
    return PropertyUserMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PropertyUser[]> {
    const entities = await this.propertyUserRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => PropertyUserMapper.toDomain(entity));
  }

  async findById(id: PropertyUser['id']): Promise<NullableType<PropertyUser>> {
    const entity = await this.propertyUserRepository.findOne({
      where: { id },
    });

    return entity ? PropertyUserMapper.toDomain(entity) : null;
  }

  async findByIds(ids: PropertyUser['id'][]): Promise<PropertyUser[]> {
    const entities = await this.propertyUserRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => PropertyUserMapper.toDomain(entity));
  }

  async update(
    id: PropertyUser['id'],
    payload: DeepPartial<PropertyUser>,
  ): Promise<PropertyUser> {
    const entity = await this.propertyUserRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.propertyUserRepository.save(
      this.propertyUserRepository.create(
        PropertyUserMapper.toPersistence({
          ...PropertyUserMapper.toDomain(entity),
          ...payload,
        } as PropertyUser),
      ),
    );

    return PropertyUserMapper.toDomain(updatedEntity);
  }

  async remove(id: PropertyUser['id']): Promise<void> {
    await this.propertyUserRepository.delete(id);
  }
}
