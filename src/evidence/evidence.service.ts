import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MissionsService } from '../missions/missions.service';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { Evidence } from './domain/evidence';
import { EvidenceRepository } from './infrastructure/persistence/evidence.repository';

@Injectable()
export class EvidenceService {
  constructor(
    private readonly missionsService: MissionsService,
    private readonly evidenceRepository: EvidenceRepository,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto) {
    const mission = await this.getMissionOrFail(createEvidenceDto.mission.id);

    return this.evidenceRepository.create({
      mission,
      coordenada: createEvidenceDto.coordenada,
      fotoUrl: createEvidenceDto.fotoUrl,
      timestamp: createEvidenceDto.timestamp,
      mortalidadeTaxa: createEvidenceDto.mortalidadeTaxa,
    } as Evidence);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.evidenceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Evidence['id']) {
    return this.evidenceRepository.findById(id);
  }

  findByIds(ids: Evidence['id'][]) {
    return this.evidenceRepository.findByIds(ids);
  }

  async update(id: Evidence['id'], updateEvidenceDto: UpdateEvidenceDto) {
    const payload: Partial<Evidence> = {
      coordenada: updateEvidenceDto.coordenada,
      fotoUrl: updateEvidenceDto.fotoUrl,
      timestamp: updateEvidenceDto.timestamp,
      mortalidadeTaxa: updateEvidenceDto.mortalidadeTaxa,
    };

    if (updateEvidenceDto.mission) {
      payload.mission = await this.getMissionOrFail(
        updateEvidenceDto.mission.id,
      );
    }

    return this.evidenceRepository.update(id, payload);
  }

  remove(id: Evidence['id']) {
    return this.evidenceRepository.remove(id);
  }

  private async getMissionOrFail(id: Evidence['mission']['id']) {
    const mission = await this.missionsService.findById(id);

    if (!mission) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          mission: 'notExists',
        },
      });
    }

    return mission;
  }
}
