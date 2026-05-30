import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AffectedAreasService } from './affected-areas.service';
import { AffectedAreasController } from './affected-areas.controller';
import { RelationalAffectedAreaPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalAffectedAreaPersistenceModule,
  ],
  controllers: [AffectedAreasController],
  providers: [AffectedAreasService],
  exports: [AffectedAreasService, RelationalAffectedAreaPersistenceModule],
})
export class AffectedAreasModule {}
