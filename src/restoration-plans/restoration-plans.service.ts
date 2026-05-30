import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateRestorationPlanDto } from './dto/create-restoration-plan.dto';
import { UpdateRestorationPlanDto } from './dto/update-restoration-plan.dto';
import { RestorationPlanRepository } from './infrastructure/persistence/restoration-plan.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { RestorationPlan } from './domain/restoration-plan';
import { Property } from '../properties/domain/property';
import { User } from '../users/domain/user';

@Injectable()
export class RestorationPlansService {
  constructor(
    // Dependencies here
    private readonly restorationPlanRepository: RestorationPlanRepository,
  ) {}

  async create(createRestorationPlanDto: CreateRestorationPlanDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.restorationPlanRepository.create({
      property: { id: createRestorationPlanDto.property.id } as Property,
      title: createRestorationPlanDto.title,
      status: createRestorationPlanDto.status ?? 'draft',
      planType: createRestorationPlanDto.planType ?? 'prad',
      createdBy: createRestorationPlanDto.createdBy
        ? ({ id: createRestorationPlanDto.createdBy.id } as User)
        : null,
      currentVersionId: createRestorationPlanDto.currentVersionId,
      approvedAt: createRestorationPlanDto.approvedAt,
      notes: createRestorationPlanDto.notes,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.restorationPlanRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: RestorationPlan['id']) {
    return this.restorationPlanRepository.findById(id);
  }

  findByIds(ids: RestorationPlan['id'][]) {
    return this.restorationPlanRepository.findByIds(ids);
  }

  async update(
    id: RestorationPlan['id'],
    updateRestorationPlanDto: UpdateRestorationPlanDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.restorationPlanRepository.update(id, {
      property: updateRestorationPlanDto.property
        ? ({ id: updateRestorationPlanDto.property.id } as Property)
        : undefined,
      title: updateRestorationPlanDto.title,
      status: updateRestorationPlanDto.status,
      planType: updateRestorationPlanDto.planType,
      createdBy: updateRestorationPlanDto.createdBy
        ? ({ id: updateRestorationPlanDto.createdBy.id } as User)
        : undefined,
      currentVersionId: updateRestorationPlanDto.currentVersionId,
      approvedAt: updateRestorationPlanDto.approvedAt,
      notes: updateRestorationPlanDto.notes,
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: RestorationPlan['id']) {
    return this.restorationPlanRepository.remove(id);
  }
}
