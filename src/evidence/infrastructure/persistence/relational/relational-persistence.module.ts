import { Module } from '@nestjs/common';
import { EvidenceRepository } from '../evidence.repository';
import { EvidenceRelationalRepository } from './repositories/evidence.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvidenceEntity } from './entities/evidence.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvidenceEntity])],
  providers: [
    {
      provide: EvidenceRepository,
      useClass: EvidenceRelationalRepository,
    },
  ],
  exports: [EvidenceRepository],
})
export class RelationalEvidencePersistenceModule {}
