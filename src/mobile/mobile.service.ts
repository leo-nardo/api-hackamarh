import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CollectionPointEntity } from '../collection-points/infrastructure/persistence/relational/entities/collection-point.entity';
import { MissionScheduleEntity } from '../mission-schedules/infrastructure/persistence/relational/entities/mission-schedule.entity';
import { MissionEntity } from '../missions/infrastructure/persistence/relational/entities/mission.entity';

@Injectable()
export class MobileService {
  constructor(
    @InjectRepository(MissionEntity)
    private readonly missionRepository: Repository<MissionEntity>,
    @InjectRepository(CollectionPointEntity)
    private readonly collectionPointRepository: Repository<CollectionPointEntity>,
    @InjectRepository(MissionScheduleEntity)
    private readonly missionScheduleRepository: Repository<MissionScheduleEntity>,
  ) {}

  async findAssignedMissions(userId: number) {
    const missions = await this.missionRepository.find({
      order: { createdAt: 'DESC' },
      where: { assignedTo: { id: userId } },
    });
    const missionIds = missions.map((mission) => mission.id);
    const affectedAreaIds = missions
      .map((mission) => mission.affectedArea?.id)
      .filter((id): id is string => Boolean(id));

    const [collectionPoints, schedules] = await Promise.all([
      affectedAreaIds.length
        ? this.collectionPointRepository.find({
            order: { sortOrder: 'ASC', name: 'ASC' },
            where: {
              affectedArea: { id: In(affectedAreaIds) },
              isActive: true,
            },
          })
        : [],
      missionIds.length
        ? this.missionScheduleRepository.find({
            where: { mission: { id: In(missionIds) } },
          })
        : [],
    ]);

    const pointsByArea = new Map<string, CollectionPointEntity[]>();

    for (const point of collectionPoints) {
      const affectedAreaId = point.affectedArea.id;
      const points = pointsByArea.get(affectedAreaId) ?? [];
      points.push(point);
      pointsByArea.set(affectedAreaId, points);
    }

    const scheduleByMission = new Map<string, MissionScheduleEntity>(
      schedules.map((schedule): [string, MissionScheduleEntity] => [
        schedule.mission.id,
        schedule,
      ]),
    );

    return missions.map((mission) => {
      const affectedArea = mission.affectedArea;
      const property = affectedArea?.property;
      const schedule = scheduleByMission.get(mission.id);

      return {
        id: mission.id,
        dueDate: mission.dueDate,
        name: mission.name,
        objective: mission.objective,
        priority: mission.priority,
        status: mission.status,
        schedule: schedule
          ? {
              deadlineAt: schedule.deadlineAt,
              endsAt: schedule.endsAt,
              startsAt: schedule.startsAt,
              status: schedule.status,
            }
          : null,
        property: property
          ? {
              carCode: property.carCode,
              id: property.id,
              name: property.name,
            }
          : null,
        affectedArea: affectedArea
          ? {
              areaHa: affectedArea.areaHa,
              areaType: affectedArea.areaType,
              geom: affectedArea.geom,
              id: affectedArea.id,
              name: affectedArea.name,
              status: affectedArea.status,
            }
          : null,
        collectionPoints: affectedArea
          ? (pointsByArea.get(affectedArea.id) ?? []).map((point) => ({
              id: point.id,
              instructions: point.instructions,
              location: point.location,
              name: point.name,
              pointType: point.pointType,
              radiusMeters: point.radiusMeters,
              requiredPhotoCount: point.requiredPhotoCount,
              sortOrder: point.sortOrder,
            }))
          : [],
      };
    });
  }
}
