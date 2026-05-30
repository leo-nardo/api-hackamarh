import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { MissionDto } from '../../missions/dto/mission.dto';

export class CreateEvidenceDto {
  @ApiProperty({
    type: () => MissionDto,
  })
  @ValidateNested()
  @Type(() => MissionDto)
  @IsNotEmptyObject()
  mission: MissionDto;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
  })
  @IsObject()
  coordenada: Point;

  @ApiProperty({
    type: String,
  })
  @IsString()
  fotoUrl: string;

  @ApiProperty({
    type: Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  timestamp: Date;

  @ApiProperty({
    nullable: true,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  mortalidadeTaxa?: number | null;
}
