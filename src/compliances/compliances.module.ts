import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CompliancesService } from './compliances.service';
import { CompliancesController } from './compliances.controller';
import { RelationalCompliancePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ExternalObservationsModule } from '../external-observations/external-observations.module';
import { EvidenceModule } from '../evidence/evidence.module';

@Module({
  imports: [
    RelationalCompliancePersistenceModule,
    ExternalObservationsModule,
    EvidenceModule,
  ],
  controllers: [CompliancesController],
  providers: [CompliancesService],
  exports: [CompliancesService, RelationalCompliancePersistenceModule],
})
export class CompliancesModule {}
