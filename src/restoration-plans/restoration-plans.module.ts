import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { RestorationPlansService } from './restoration-plans.service';
import { RestorationPlansController } from './restoration-plans.controller';
import { RelationalRestorationPlanPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalRestorationPlanPersistenceModule,
  ],
  controllers: [RestorationPlansController],
  providers: [RestorationPlansService],
  exports: [
    RestorationPlansService,
    RelationalRestorationPlanPersistenceModule,
  ],
})
export class RestorationPlansModule {}
