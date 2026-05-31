import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { FilesModule } from '../files/files.module';
import { MailModule } from '../mail/mail.module';
import { PropertiesModule } from '../properties/properties.module';
import { PropertyUsersModule } from '../property-users/property-users.module';
import { ExternalObservationsModule } from '../external-observations/external-observations.module';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    MailModule,
    PropertiesModule,
    PropertyUsersModule,
    ExternalObservationsModule,
  ],

  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
