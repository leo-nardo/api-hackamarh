import { Module } from '@nestjs/common';
import { ExternalReferenceRepository } from '../external-reference.repository';
import { ExternalReferenceRelationalRepository } from './repositories/external-reference.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalReferenceEntity } from './entities/external-reference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalReferenceEntity])],
  providers: [
    {
      provide: ExternalReferenceRepository,
      useClass: ExternalReferenceRelationalRepository,
    },
  ],
  exports: [ExternalReferenceRepository],
})
export class RelationalExternalReferencePersistenceModule {}
