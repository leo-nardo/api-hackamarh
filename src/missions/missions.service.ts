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

@Injectable()
export class MissionsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly missionRepository: MissionRepository,
  ) {}

  async create(createMissionDto: CreateMissionDto) {
    const tecnico = await this.getTecnicoOrFail(createMissionDto.tecnico.id);

    return this.missionRepository.create({
      nome: createMissionDto.nome,
      codigoCar: createMissionDto.codigoCar,
      poligono: createMissionDto.poligono,
      tecnico,
      status: createMissionDto.status,
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
      nome: updateMissionDto.nome,
      codigoCar: updateMissionDto.codigoCar,
      poligono: updateMissionDto.poligono,
      status: updateMissionDto.status,
    };

    if (updateMissionDto.tecnico) {
      payload.tecnico = await this.getTecnicoOrFail(
        updateMissionDto.tecnico.id,
      );
    }

    return this.missionRepository.update(id, payload);
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
