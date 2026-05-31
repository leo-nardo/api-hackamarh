import {
  Controller,
  Get,
  Req,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { MobileService } from './mobile.service';

@ApiTags('Mobile')
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'mobile',
  version: VERSION_NEUTRAL,
})
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @Get('missions')
  findAssignedMissions(@Req() request: { user: JwtPayloadType }) {
    return this.mobileService.findAssignedMissions(Number(request.user.id));
  }
}
