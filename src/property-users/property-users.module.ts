import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { PropertyUsersService } from './property-users.service';
import { PropertyUsersController } from './property-users.controller';
import { RelationalPropertyUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalPropertyUserPersistenceModule,
  ],
  controllers: [PropertyUsersController],
  providers: [PropertyUsersService],
  exports: [PropertyUsersService, RelationalPropertyUserPersistenceModule],
})
export class PropertyUsersModule {}
