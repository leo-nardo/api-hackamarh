import { Module } from '@nestjs/common';
import { MissionRepository } from '../mission.repository';
import { MissionRelationalRepository } from './repositories/mission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from './entities/mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MissionEntity])],
  providers: [
    {
      provide: MissionRepository,
      useClass: MissionRelationalRepository,
    },
  ],
  exports: [MissionRepository],
})
export class RelationalMissionPersistenceModule {}
