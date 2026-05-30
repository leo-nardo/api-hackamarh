import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type ms from 'ms';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class PowersyncService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(user: JwtPayloadType): Promise<{ token: string }> {
    const expiresIn =
      process.env.POWERSYNC_JWT_EXPIRES_IN ??
      this.configService.getOrThrow('auth.expires', {
        infer: true,
      });
    const secret =
      process.env.POWERSYNC_JWT_SECRET ??
      this.configService.getOrThrow('auth.secret', { infer: true });

    const token = await this.jwtService.signAsync(
      {
        sub: String(user.id),
        userId: user.id,
        role: user.role,
        sessionId: user.sessionId,
      },
      {
        expiresIn: expiresIn as ms.StringValue,
        secret,
      },
    );

    return { token };
  }
}
