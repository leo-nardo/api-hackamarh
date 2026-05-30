import { Module } from '@nestjs/common';
import { PropertyRepository } from '../property.repository';
import { PropertyRelationalRepository } from './repositories/property.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyEntity])],
  providers: [
    {
      provide: PropertyRepository,
      useClass: PropertyRelationalRepository,
    },
  ],
  exports: [PropertyRepository],
})
export class RelationalPropertyPersistenceModule {}
