import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { ExternalObservationsService } from './external-observations.service';
import { ExternalObservationsController } from './external-observations.controller';
import { RelationalExternalObservationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalExternalObservationPersistenceModule,
  ],
  controllers: [ExternalObservationsController],
  providers: [ExternalObservationsService],
  exports: [
    ExternalObservationsService,
    RelationalExternalObservationPersistenceModule,
  ],
})
export class ExternalObservationsModule {}
