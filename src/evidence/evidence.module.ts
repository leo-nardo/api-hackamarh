import { Module } from '@nestjs/common';
import { MissionsModule } from '../missions/missions.module';
import { EvidenceController } from './evidence.controller';
import { EvidenceService } from './evidence.service';
import { RelationalEvidencePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [MissionsModule, RelationalEvidencePersistenceModule],
  controllers: [EvidenceController],
  providers: [EvidenceService],
  exports: [EvidenceService, RelationalEvidencePersistenceModule],
})
export class EvidenceModule {}
