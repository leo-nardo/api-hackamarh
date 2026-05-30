import { Module } from '@nestjs/common';
import { AffectedAreaRepository } from '../affected-area.repository';
import { AffectedAreaRelationalRepository } from './repositories/affected-area.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffectedAreaEntity } from './entities/affected-area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AffectedAreaEntity])],
  providers: [
    {
      provide: AffectedAreaRepository,
      useClass: AffectedAreaRelationalRepository,
    },
  ],
  exports: [AffectedAreaRepository],
})
export class RelationalAffectedAreaPersistenceModule {}
