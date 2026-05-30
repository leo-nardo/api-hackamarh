import { Module } from '@nestjs/common';
import { ExternalObservationRepository } from '../external-observation.repository';
import { ExternalObservationRelationalRepository } from './repositories/external-observation.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalObservationEntity } from './entities/external-observation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalObservationEntity])],
  providers: [
    {
      provide: ExternalObservationRepository,
      useClass: ExternalObservationRelationalRepository,
    },
  ],
  exports: [ExternalObservationRepository],
})
export class RelationalExternalObservationPersistenceModule {}
