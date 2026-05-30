import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateAffectedAreaDto } from './dto/create-affected-area.dto';
import { UpdateAffectedAreaDto } from './dto/update-affected-area.dto';
import { AffectedAreaRepository } from './infrastructure/persistence/affected-area.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AffectedArea } from './domain/affected-area';
import { Property } from '../properties/domain/property';
import { RestorationPlanVersion } from '../restoration-plan-versions/domain/restoration-plan-version';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class AffectedAreasService {
  constructor(
    // Dependencies here
    private readonly affectedAreaRepository: AffectedAreaRepository,
  ) {}

  async create(createAffectedAreaDto: CreateAffectedAreaDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.affectedAreaRepository.create({
      property: { id: createAffectedAreaDto.property.id } as Property,
      restorationPlanVersion: createAffectedAreaDto.restorationPlanVersion
        ? ({
            id: createAffectedAreaDto.restorationPlanVersion.id,
          } as RestorationPlanVersion)
        : null,
      name: createAffectedAreaDto.name,
      areaType: createAffectedAreaDto.areaType ?? 'restoration',
      status: createAffectedAreaDto.status ?? 'active',
      geom: createAffectedAreaDto.geom,
      areaHa: createAffectedAreaDto.areaHa,
      priority: createAffectedAreaDto.priority,
      notes: createAffectedAreaDto.notes,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.affectedAreaRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: AffectedArea['id']) {
    return this.affectedAreaRepository.findById(id);
  }

  findByIds(ids: AffectedArea['id'][]) {
    return this.affectedAreaRepository.findByIds(ids);
  }

  async update(
    id: AffectedArea['id'],
    updateAffectedAreaDto: UpdateAffectedAreaDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.affectedAreaRepository.update(id, {
      property: updateAffectedAreaDto.property
        ? ({ id: updateAffectedAreaDto.property.id } as Property)
        : undefined,
      restorationPlanVersion: updateAffectedAreaDto.restorationPlanVersion
        ? ({
            id: updateAffectedAreaDto.restorationPlanVersion.id,
          } as RestorationPlanVersion)
        : undefined,
      name: updateAffectedAreaDto.name,
      areaType: updateAffectedAreaDto.areaType,
      status: updateAffectedAreaDto.status,
      geom: updateAffectedAreaDto.geom,
      areaHa: updateAffectedAreaDto.areaHa,
      priority: updateAffectedAreaDto.priority,
      notes: updateAffectedAreaDto.notes,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<AffectedArea>);
  }

  remove(id: AffectedArea['id']) {
    return this.affectedAreaRepository.remove(id);
  }
}
