import { Module } from '@nestjs/common';
import { RestorationPlanRepository } from '../restoration-plan.repository';
import { RestorationPlanRelationalRepository } from './repositories/restoration-plan.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestorationPlanEntity } from './entities/restoration-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestorationPlanEntity])],
  providers: [
    {
      provide: RestorationPlanRepository,
      useClass: RestorationPlanRelationalRepository,
    },
  ],
  exports: [RestorationPlanRepository],
})
export class RelationalRestorationPlanPersistenceModule {}
