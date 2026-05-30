import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { RelationalPropertyPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalPropertyPersistenceModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService, RelationalPropertyPersistenceModule],
})
export class PropertiesModule {}
