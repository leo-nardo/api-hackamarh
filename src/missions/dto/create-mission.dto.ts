import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Polygon } from 'typeorm/driver/types/GeoJsonTypes';
import { UserDto } from '../../users/dto/user.dto';

export class CreateMissionDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  nome: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  codigoCar: string;

  @ApiProperty({
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [-48.123, -15.456],
          [-48.124, -15.456],
          [-48.124, -15.457],
          [-48.123, -15.456],
        ],
      ],
    },
  })
  @IsObject()
  poligono: Polygon;

  @ApiProperty({
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  tecnico: UserDto;

  @ApiProperty({
    enum: ['pending', 'completed'],
  })
  @IsString()
  @IsIn(['pending', 'completed'])
  status: string;
}
