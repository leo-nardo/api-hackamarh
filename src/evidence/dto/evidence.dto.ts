import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EvidenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
