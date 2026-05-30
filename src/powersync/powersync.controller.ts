import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import {
  PowerSyncOperationDto,
  PowerSyncUploadDto,
} from './dto/powersync-upload.dto';
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

  @Post('data')
  @HttpCode(HttpStatus.OK)
  syncBatch(
    @Body() body: PowerSyncUploadDto | PowerSyncOperationDto[],
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  syncUploadAlias(
    @Body() body: PowerSyncUploadDto | PowerSyncOperationDto[],
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user);
  }

  @Put('data')
  @HttpCode(HttpStatus.OK)
  putData(
    @Body() body: PowerSyncOperationDto,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user, { op: 'PUT' });
  }

  @Put('data/:table')
  @HttpCode(HttpStatus.OK)
  putTableData(
    @Param('table') table: string,
    @Body() body: PowerSyncOperationDto,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user, {
      op: 'PUT',
      table,
    });
  }

  @Patch('data')
  @HttpCode(HttpStatus.OK)
  patchData(
    @Body() body: PowerSyncOperationDto,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user, { op: 'PATCH' });
  }

  @Patch('data/:table')
  @HttpCode(HttpStatus.OK)
  patchTableData(
    @Param('table') table: string,
    @Body() body: PowerSyncOperationDto,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user, {
      op: 'PATCH',
      table,
    });
  }

  @Delete('data')
  @HttpCode(HttpStatus.OK)
  deleteData(
    @Body() body: PowerSyncOperationDto,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload(body, request.user, { op: 'DELETE' });
  }

  @Delete('data/:table/:id')
  @HttpCode(HttpStatus.OK)
  deleteTableData(
    @Param('table') table: string,
    @Param('id') id: string,
    @Req() request: { user: JwtPayloadType },
  ) {
    return this.powersyncService.upload({}, request.user, {
      op: 'DELETE',
      table,
      id,
    });
  }
}
