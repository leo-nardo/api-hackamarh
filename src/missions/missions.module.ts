import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RelationalMissionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';

@Module({
  imports: [UsersModule, RelationalMissionPersistenceModule],
  controllers: [MissionsController],
  providers: [MissionsService],
  exports: [MissionsService, RelationalMissionPersistenceModule],
})
export class MissionsModule {}
