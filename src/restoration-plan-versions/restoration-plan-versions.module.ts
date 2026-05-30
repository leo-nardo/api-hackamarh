import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { RestorationPlanVersionsService } from './restoration-plan-versions.service';
import { RestorationPlanVersionsController } from './restoration-plan-versions.controller';
import { RelationalRestorationPlanVersionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalRestorationPlanVersionPersistenceModule,
  ],
  controllers: [RestorationPlanVersionsController],
  providers: [RestorationPlanVersionsService],
  exports: [
    RestorationPlanVersionsService,
    RelationalRestorationPlanVersionPersistenceModule,
  ],
})
export class RestorationPlanVersionsModule {}
