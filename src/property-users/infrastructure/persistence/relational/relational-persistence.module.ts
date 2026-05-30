import { Module } from '@nestjs/common';
import { PropertyUserRepository } from '../property-user.repository';
import { PropertyUserRelationalRepository } from './repositories/property-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyUserEntity } from './entities/property-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyUserEntity])],
  providers: [
    {
      provide: PropertyUserRepository,
      useClass: PropertyUserRelationalRepository,
    },
  ],
  exports: [PropertyUserRepository],
})
export class RelationalPropertyUserPersistenceModule {}
