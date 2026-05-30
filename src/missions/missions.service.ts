import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './domain/mission';
import { MissionRepository } from './infrastructure/persistence/mission.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { User } from '../users/domain/user';
import { AffectedArea } from '../affected-areas/domain/affected-area';
import { DeepPartial } from '../utils/types/deep-partial.type';

@Injectable()
export class MissionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly missionRepository: MissionRepository,
  ) {}

  async create(createMissionDto: CreateMissionDto) {
    const assignedTo = await this.getTecnicoOrFail(
      createMissionDto.assignedTo.id,
    );

    return this.missionRepository.create({
      name: createMissionDto.name,
      objective: createMissionDto.objective,
      affectedArea: createMissionDto.affectedArea
        ? ({ id: createMissionDto.affectedArea.id } as AffectedArea)
        : null,
      assignedTo,
      createdBy: createMissionDto.createdBy
        ? ({ id: createMissionDto.createdBy.id } as User)
        : null,
      status: createMissionDto.status ?? 'scheduled',
      priority: createMissionDto.priority ?? 'normal',
      dueDate: createMissionDto.dueDate,
    } as Mission);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.missionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Mission['id']) {
    return this.missionRepository.findById(id);
  }

  findByIds(ids: Mission['id'][]) {
    return this.missionRepository.findByIds(ids);
  }

  async update(id: Mission['id'], updateMissionDto: UpdateMissionDto) {
    const payload: Partial<Mission> = {
      name: updateMissionDto.name,
      objective: updateMissionDto.objective,
      affectedArea: updateMissionDto.affectedArea
        ? ({ id: updateMissionDto.affectedArea.id } as AffectedArea)
        : undefined,
      status: updateMissionDto.status,
      priority: updateMissionDto.priority,
      dueDate: updateMissionDto.dueDate,
    };

    if (updateMissionDto.assignedTo) {
      payload.assignedTo = await this.getTecnicoOrFail(
        updateMissionDto.assignedTo.id,
      );
    }

    if (updateMissionDto.createdBy) {
      payload.createdBy = { id: updateMissionDto.createdBy.id } as User;
    }

    return this.missionRepository.update(id, payload as DeepPartial<Mission>);
  }

  remove(id: Mission['id']) {
    return this.missionRepository.remove(id);
  }

  private async getTecnicoOrFail(id: User['id']) {
    const tecnico = await this.usersService.findById(id);

    if (!tecnico) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          tecnico: 'notExists',
        },
      });
    }

    return tecnico;
  }
}
