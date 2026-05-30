import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionPointEntity } from '../collection-points/infrastructure/persistence/relational/entities/collection-point.entity';
import { MissionScheduleEntity } from '../mission-schedules/infrastructure/persistence/relational/entities/mission-schedule.entity';
import { MissionEntity } from '../missions/infrastructure/persistence/relational/entities/mission.entity';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CollectionPointEntity,
      MissionEntity,
      MissionScheduleEntity,
    ]),
  ],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
