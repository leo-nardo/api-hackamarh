import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ExternalReferencesService } from './external-references.service';
import { ExternalReferencesController } from './external-references.controller';
import { RelationalExternalReferencePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalExternalReferencePersistenceModule,
  ],
  controllers: [ExternalReferencesController],
  providers: [ExternalReferencesService],
  exports: [
    ExternalReferencesService,
    RelationalExternalReferencePersistenceModule,
  ],
})
export class ExternalReferencesModule {}
