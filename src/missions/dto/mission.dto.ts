import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
