import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AffectedAreaEntity } from '../../../../affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { CollectionPointEntity } from '../../../../collection-points/infrastructure/persistence/relational/entities/collection-point.entity';
import { MissionScheduleEntity } from '../../../../mission-schedules/infrastructure/persistence/relational/entities/mission-schedule.entity';
import { MissionEntity } from '../../../../missions/infrastructure/persistence/relational/entities/mission.entity';
import { PropertyEntity } from '../../../../properties/infrastructure/persistence/relational/entities/property.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

const DEMO_PROPERTY_ID = '4d2e6a90-01c7-4697-bb74-c4f9a7364d62';
const DEMO_AFFECTED_AREA_ID = '0fae0d8a-961c-459d-85af-9f278508a208';
const DEMO_MISSION_ID = 'd19175a0-f7d1-4f9b-9c07-1d743f0e6e4f';

@Injectable()
export class DemoSeedService {
  constructor(
    @InjectRepository(PropertyEntity)
    private readonly propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(AffectedAreaEntity)
    private readonly affectedAreaRepository: Repository<AffectedAreaEntity>,
    @InjectRepository(CollectionPointEntity)
    private readonly collectionPointRepository: Repository<CollectionPointEntity>,
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    @InjectRepository(MissionScheduleEntity)
    private readonly missionScheduleRepository: Repository<MissionScheduleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async run(): Promise<void> {
    const technician = await this.userRepository.findOne({
      where: { email: 'john.doe@example.com' },
    });

    if (!technician) {
      return;
    }

    const property = await this.ensureProperty();
    const affectedArea = await this.ensureAffectedArea(property);
    await this.ensureCollectionPoints(affectedArea);
    const mission = await this.ensureMission(affectedArea, technician);
    await this.ensureSchedule(mission);
  }

  private async ensureProperty(): Promise<PropertyEntity> {
    const existing = await this.propertyRepository.findOne({
      where: { carCode: 'TO-DEMO-0001' },
    });

    if (existing) {
      return existing;
    }

    return this.propertyRepository.save(
      this.propertyRepository.create({
        carCode: 'TO-DEMO-0001',
        externalCode: 'SIGCAR-DEMO-0001',
        geom: {
          type: 'Polygon',
          coordinates: [
            [
              [-48.3339, -10.1862],
              [-48.3297, -10.1862],
              [-48.3297, -10.1819],
              [-48.3339, -10.1819],
              [-48.3339, -10.1862],
            ],
          ],
        },
        id: DEMO_PROPERTY_ID,
        municipality: 'Palmas',
        name: 'Fazenda Demo Hackamarh',
        ownerName: 'Produtor Demo',
        source: 'seed',
        state: 'TO',
        totalAreaHa: 125.4,
      }),
    );
  }

  private async ensureAffectedArea(
    property: PropertyEntity,
  ): Promise<AffectedAreaEntity> {
    const existing = await this.affectedAreaRepository.findOne({
      where: { id: DEMO_AFFECTED_AREA_ID },
    });

    if (existing) {
      return existing;
    }

    return this.affectedAreaRepository.save(
      this.affectedAreaRepository.create({
        areaHa: 4.8,
        areaType: 'app_nascente',
        geom: {
          type: 'Polygon',
          coordinates: [
            [
              [-48.3328, -10.1853],
              [-48.3308, -10.1852],
              [-48.3307, -10.1834],
              [-48.3327, -10.1835],
              [-48.3328, -10.1853],
            ],
          ],
        },
        id: DEMO_AFFECTED_AREA_ID,
        name: 'APP Nascente Sul',
        notes: 'Area demo para o fluxo de coleta de evidencias em campo.',
        priority: 1,
        property,
        status: 'active',
      }),
    );
  }

  private async ensureCollectionPoints(
    affectedArea: AffectedAreaEntity,
  ): Promise<void> {
    const count = await this.collectionPointRepository.count({
      where: { affectedArea: { id: affectedArea.id } },
    });

    if (count > 0) {
      return;
    }

    await this.collectionPointRepository.save([
      this.collectionPointRepository.create({
        affectedArea,
        instructions: 'Tirar foto apontando para a area restaurada.',
        location: {
          type: 'Point',
          coordinates: [-48.332, -10.1848],
        },
        name: 'Ponto 1 - Borda oeste',
        pointType: 'field_photo',
        radiusMeters: 30,
        requiredPhotoCount: 1,
        sortOrder: 1,
      }),
      this.collectionPointRepository.create({
        affectedArea,
        instructions: 'Tirar foto da cobertura vegetal proxima a nascente.',
        location: {
          type: 'Point',
          coordinates: [-48.3312, -10.1839],
        },
        name: 'Ponto 2 - Nascente',
        pointType: 'field_photo',
        radiusMeters: 25,
        requiredPhotoCount: 1,
        sortOrder: 2,
      }),
    ]);
  }

  private async ensureMission(
    affectedArea: AffectedAreaEntity,
    technician: UserEntity,
  ): Promise<MissionEntity> {
    const existing = await this.missionRepository.findOne({
      where: { id: DEMO_MISSION_ID },
    });

    if (existing) {
      return existing;
    }

    return this.missionRepository.save(
      this.missionRepository.create({
        affectedArea,
        assignedTo: technician,
        dueDate: new Date('2026-06-30T00:00:00.000Z'),
        id: DEMO_MISSION_ID,
        name: 'Coleta PRAD - APP Nascente Sul',
        objective: 'Coletar fotos georreferenciadas dos pontos definidos.',
        priority: 'high',
        status: 'scheduled',
      }),
    );
  }

  private async ensureSchedule(mission: MissionEntity): Promise<void> {
    const existing = await this.missionScheduleRepository.findOne({
      where: { mission: { id: mission.id } },
    });

    if (existing) {
      return;
    }

    await this.missionScheduleRepository.save(
      this.missionScheduleRepository.create({
        deadlineAt: new Date('2026-06-30T21:00:00.000Z'),
        endsAt: new Date('2026-06-30T20:00:00.000Z'),
        mission,
        notes: 'Janela demo para coleta offline pelo app Flutter.',
        startsAt: new Date('2026-06-30T11:00:00.000Z'),
        status: 'scheduled',
      }),
    );
  }
}
