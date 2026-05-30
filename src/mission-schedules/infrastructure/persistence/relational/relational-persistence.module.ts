import { Module } from '@nestjs/common';
import { MissionScheduleRepository } from '../mission-schedule.repository';
import { MissionScheduleRelationalRepository } from './repositories/mission-schedule.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionScheduleEntity } from './entities/mission-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissionScheduleEntity])],
  providers: [
    {
      provide: MissionScheduleRepository,
      useClass: MissionScheduleRelationalRepository,
    },
  ],
  exports: [MissionScheduleRepository],
})
export class RelationalMissionSchedulePersistenceModule {}
