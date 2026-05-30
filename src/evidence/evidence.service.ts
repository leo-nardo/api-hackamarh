import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CollectionPoint } from '../collection-points/domain/collection-point';
import { MissionsService } from '../missions/missions.service';
import { User } from '../users/domain/user';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { DeepPartial } from '../utils/types/deep-partial.type';
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
      collectionPoint: createEvidenceDto.collectionPoint
        ? ({ id: createEvidenceDto.collectionPoint.id } as CollectionPoint)
        : null,
      technician: createEvidenceDto.technician
        ? ({ id: createEvidenceDto.technician.id } as User)
        : null,
      location: createEvidenceDto.location,
      fotoUrl: createEvidenceDto.fotoUrl,
      capturedAt: createEvidenceDto.capturedAt,
      submittedAt: createEvidenceDto.submittedAt,
      mortalityRate: createEvidenceDto.mortalityRate,
      faseSucessional: createEvidenceDto.faseSucessional,
      metodoRestauracao: createEvidenceDto.metodoRestauracao,
      notes: createEvidenceDto.notes,
      validationStatus: createEvidenceDto.validationStatus ?? 'pending',
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
      collectionPoint: updateEvidenceDto.collectionPoint
        ? ({ id: updateEvidenceDto.collectionPoint.id } as CollectionPoint)
        : undefined,
      technician: updateEvidenceDto.technician
        ? ({ id: updateEvidenceDto.technician.id } as User)
        : undefined,
      location: updateEvidenceDto.location,
      fotoUrl: updateEvidenceDto.fotoUrl,
      capturedAt: updateEvidenceDto.capturedAt,
      submittedAt: updateEvidenceDto.submittedAt,
      mortalityRate: updateEvidenceDto.mortalityRate,
      faseSucessional: updateEvidenceDto.faseSucessional,
      metodoRestauracao: updateEvidenceDto.metodoRestauracao,
      notes: updateEvidenceDto.notes,
      validationStatus: updateEvidenceDto.validationStatus,
    };

    if (updateEvidenceDto.mission) {
      payload.mission = await this.getMissionOrFail(
        updateEvidenceDto.mission.id,
      );
    }

    return this.evidenceRepository.update(id, payload as DeepPartial<Evidence>);
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
