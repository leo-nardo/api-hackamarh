import { Module } from '@nestjs/common';
import { CollectionPointRepository } from '../collection-point.repository';
import { CollectionPointRelationalRepository } from './repositories/collection-point.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionPointEntity } from './entities/collection-point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollectionPointEntity])],
  providers: [
    {
      provide: CollectionPointRepository,
      useClass: CollectionPointRelationalRepository,
    },
  ],
  exports: [CollectionPointRepository],
})
export class RelationalCollectionPointPersistenceModule {}
