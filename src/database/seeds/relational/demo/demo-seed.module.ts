import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffectedAreaEntity } from '../../../../affected-areas/infrastructure/persistence/relational/entities/affected-area.entity';
import { CollectionPointEntity } from '../../../../collection-points/infrastructure/persistence/relational/entities/collection-point.entity';
import { MissionScheduleEntity } from '../../../../mission-schedules/infrastructure/persistence/relational/entities/mission-schedule.entity';
import { MissionEntity } from '../../../../missions/infrastructure/persistence/relational/entities/mission.entity';
import { PropertyEntity } from '../../../../properties/infrastructure/persistence/relational/entities/property.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { DemoSeedService } from './demo-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AffectedAreaEntity,
      CollectionPointEntity,
      MissionEntity,
      MissionScheduleEntity,
      PropertyEntity,
      UserEntity,
    ]),
  ],
  providers: [DemoSeedService],
  exports: [DemoSeedService],
})
export class DemoSeedModule {}
