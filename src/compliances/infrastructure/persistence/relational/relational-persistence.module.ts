import { Module } from '@nestjs/common';
import { ComplianceRepository } from '../compliance.repository';
import { ComplianceRelationalRepository } from './repositories/compliance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceEntity } from './entities/compliance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ComplianceEntity])],
  providers: [
    {
      provide: ComplianceRepository,
      useClass: ComplianceRelationalRepository,
    },
  ],
  exports: [ComplianceRepository],
})
export class RelationalCompliancePersistenceModule {}
