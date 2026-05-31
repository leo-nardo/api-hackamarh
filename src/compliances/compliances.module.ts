import {
  // do not remove this comment
  Module,
  forwardRef,
} from '@nestjs/common';
import { CompliancesService } from './compliances.service';
import { CompliancesController } from './compliances.controller';
import { RelationalCompliancePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ExternalObservationsModule } from '../external-observations/external-observations.module';
import { EvidenceModule } from '../evidence/evidence.module';
import { AffectedAreasModule } from '../affected-areas/affected-areas.module';

@Module({
  imports: [
    RelationalCompliancePersistenceModule,
    forwardRef(() => ExternalObservationsModule),
    EvidenceModule,
    AffectedAreasModule,
  ],
  controllers: [CompliancesController],
  providers: [CompliancesService],
  exports: [CompliancesService, RelationalCompliancePersistenceModule],
})
export class CompliancesModule {}
