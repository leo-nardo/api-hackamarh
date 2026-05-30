import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateRestorationPlanVersionDto } from './dto/create-restoration-plan-version.dto';
import { UpdateRestorationPlanVersionDto } from './dto/update-restoration-plan-version.dto';
import { RestorationPlanVersionRepository } from './infrastructure/persistence/restoration-plan-version.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { RestorationPlanVersion } from './domain/restoration-plan-version';
import { RestorationPlan } from '../restoration-plans/domain/restoration-plan';
import { User } from '../users/domain/user';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class RestorationPlanVersionsService {
  constructor(
    // Dependencies here
    private readonly restorationPlanVersionRepository: RestorationPlanVersionRepository,
  ) {}

  async create(
    createRestorationPlanVersionDto: CreateRestorationPlanVersionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.restorationPlanVersionRepository.create({
      restorationPlan: {
        id: createRestorationPlanVersionDto.restorationPlan.id,
      } as RestorationPlan,
      versionNumber: createRestorationPlanVersionDto.versionNumber,
      source: createRestorationPlanVersionDto.source ?? 'technician',
      status: createRestorationPlanVersionDto.status ?? 'proposed',
      proposedBy: createRestorationPlanVersionDto.proposedBy
        ? ({ id: createRestorationPlanVersionDto.proposedBy.id } as User)
        : null,
      documentUrl: createRestorationPlanVersionDto.documentUrl,
      summary: createRestorationPlanVersionDto.summary,
      contentJson: createRestorationPlanVersionDto.contentJson,
      submittedAt: createRestorationPlanVersionDto.submittedAt,
      approvedAt: createRestorationPlanVersionDto.approvedAt,
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.restorationPlanVersionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: RestorationPlanVersion['id']) {
    return this.restorationPlanVersionRepository.findById(id);
  }

  findByIds(ids: RestorationPlanVersion['id'][]) {
    return this.restorationPlanVersionRepository.findByIds(ids);
  }

  async update(
    id: RestorationPlanVersion['id'],
    updateRestorationPlanVersionDto: UpdateRestorationPlanVersionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.restorationPlanVersionRepository.update(id, {
      restorationPlan: updateRestorationPlanVersionDto.restorationPlan
        ? ({
            id: updateRestorationPlanVersionDto.restorationPlan.id,
          } as RestorationPlan)
        : undefined,
      versionNumber: updateRestorationPlanVersionDto.versionNumber,
      source: updateRestorationPlanVersionDto.source,
      status: updateRestorationPlanVersionDto.status,
      proposedBy: updateRestorationPlanVersionDto.proposedBy
        ? ({ id: updateRestorationPlanVersionDto.proposedBy.id } as User)
        : undefined,
      documentUrl: updateRestorationPlanVersionDto.documentUrl,
      summary: updateRestorationPlanVersionDto.summary,
      contentJson: updateRestorationPlanVersionDto.contentJson,
      submittedAt: updateRestorationPlanVersionDto.submittedAt,
      approvedAt: updateRestorationPlanVersionDto.approvedAt,
      // Do not remove comment below.
      // <updating-property-payload />
    } as DeepPartial<RestorationPlanVersion>);
  }

  remove(id: RestorationPlanVersion['id']) {
    return this.restorationPlanVersionRepository.remove(id);
  }
}
