import {
  Controller,
  Get,
  Req,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { PowersyncService } from './powersync.service';

@ApiTags('PowerSync')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'powersync',
  version: VERSION_NEUTRAL,
})
export class PowersyncController {
  constructor(private readonly powersyncService: PowersyncService) {}

  @Get('token')
  @ApiOkResponse({
    schema: {
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  createToken(@Req() request: { user: JwtPayloadType }) {
    return this.powersyncService.createToken(request.user);
  }
}
