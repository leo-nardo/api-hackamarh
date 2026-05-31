import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalObservationsService } from './external-observations.service';
import { MapBiomasService } from './mapbiomas.service';
import { ExternalObservationsController } from './external-observations.controller';
import { RelationalExternalObservationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    HttpModule,
    RelationalExternalObservationPersistenceModule,
  ],
  controllers: [ExternalObservationsController],
  providers: [
    ExternalObservationsService,
    {
      provide: MapBiomasService,
      useClass: MapBiomasService,
    },
  ],
  exports: [
    ExternalObservationsService,
    MapBiomasService,
    RelationalExternalObservationPersistenceModule,
  ],
})
export class ExternalObservationsModule {}
