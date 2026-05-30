import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CollectionPointsService } from './collection-points.service';
import { CollectionPointsController } from './collection-points.controller';
import { RelationalCollectionPointPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalCollectionPointPersistenceModule,
  ],
  controllers: [CollectionPointsController],
  providers: [CollectionPointsService],
  exports: [
    CollectionPointsService,
    RelationalCollectionPointPersistenceModule,
  ],
})
export class CollectionPointsModule {}
