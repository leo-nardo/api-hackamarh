import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExternalObservationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
