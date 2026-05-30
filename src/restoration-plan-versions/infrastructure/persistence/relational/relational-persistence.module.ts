import { Module } from '@nestjs/common';
import { RestorationPlanVersionRepository } from '../restoration-plan-version.repository';
import { RestorationPlanVersionRelationalRepository } from './repositories/restoration-plan-version.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestorationPlanVersionEntity } from './entities/restoration-plan-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestorationPlanVersionEntity])],
  providers: [
    {
      provide: RestorationPlanVersionRepository,
      useClass: RestorationPlanVersionRelationalRepository,
    },
  ],
  exports: [RestorationPlanVersionRepository],
})
export class RelationalRestorationPlanVersionPersistenceModule {}
