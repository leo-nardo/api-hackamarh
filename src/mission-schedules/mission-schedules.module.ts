import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { MissionSchedulesService } from './mission-schedules.service';
import { MissionSchedulesController } from './mission-schedules.controller';
import { RelationalMissionSchedulePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalMissionSchedulePersistenceModule,
  ],
  controllers: [MissionSchedulesController],
  providers: [MissionSchedulesService],
  exports: [
    MissionSchedulesService,
    RelationalMissionSchedulePersistenceModule,
  ],
})
export class MissionSchedulesModule {}
