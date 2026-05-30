import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AffectedAreaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
