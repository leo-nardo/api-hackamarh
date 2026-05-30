import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExternalReferenceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
