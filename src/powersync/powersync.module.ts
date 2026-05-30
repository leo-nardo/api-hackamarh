import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PowersyncController } from './powersync.controller';
import { PowersyncService } from './powersync.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PowersyncController],
  providers: [PowersyncService],
})
export class PowersyncModule {}
