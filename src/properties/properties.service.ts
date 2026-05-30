import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyRepository } from './infrastructure/persistence/property.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Property } from './domain/property';

@Injectable()
export class PropertiesService {
  constructor(
    // Dependencies here
    private readonly propertyRepository: PropertyRepository,
  ) {}

  async create(createPropertyDto: CreatePropertyDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.propertyRepository.create({
      carCode: createPropertyDto.carCode,
      name: createPropertyDto.name,
      ownerName: createPropertyDto.ownerName,
      ownerDocument: createPropertyDto.ownerDocument,
      municipality: createPropertyDto.municipality,
      state: createPropertyDto.state,
      totalAreaHa: createPropertyDto.totalAreaHa,
      geom: createPropertyDto.geom,
      source: createPropertyDto.source ?? 'manual',
      externalCode: createPropertyDto.externalCode,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.propertyRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Property['id']) {
    return this.propertyRepository.findById(id);
  }

  findByIds(ids: Property['id'][]) {
    return this.propertyRepository.findByIds(ids);
  }

  async update(id: Property['id'], updatePropertyDto: UpdatePropertyDto) {
    // Do not remove comment below.
    // <updating-property />

    return this.propertyRepository.update(id, {
      carCode: updatePropertyDto.carCode,
      name: updatePropertyDto.name,
      ownerName: updatePropertyDto.ownerName,
      ownerDocument: updatePropertyDto.ownerDocument,
      municipality: updatePropertyDto.municipality,
      state: updatePropertyDto.state,
      totalAreaHa: updatePropertyDto.totalAreaHa,
      geom: updatePropertyDto.geom,
      source: updatePropertyDto.source,
      externalCode: updatePropertyDto.externalCode,
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Property['id']) {
    return this.propertyRepository.remove(id);
  }
}
