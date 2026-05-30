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
import { CollectionPointDto } from '../../collection-points/dto/collection-point.dto';
import { MissionDto } from '../../missions/dto/mission.dto';
import { PropertyDto } from '../../properties/dto/property.dto';
import { UserDto } from '../../users/dto/user.dto';

export class CreateEvidenceDto {
  @ApiProperty({
    type: () => MissionDto,
  })
  @ValidateNested()
  @Type(() => MissionDto)
  @IsNotEmptyObject()
  mission: MissionDto;

  @ApiProperty({
    nullable: true,
    required: false,
    type: () => PropertyDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropertyDto)
  property?: PropertyDto | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: () => CollectionPointDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CollectionPointDto)
  collectionPoint?: CollectionPointDto | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  technician?: UserDto | null;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  location?: Point;

  @ApiProperty({
    example: -15.456,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    example: -48.123,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    nullable: true,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  altitude?: number | null;

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
  capturedAt: Date;

  @ApiProperty({
    nullable: true,
    required: false,
    type: Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  submittedAt?: Date | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  deviceModel?: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  mortalityRate?: number | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  faseSucessional?: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  metodoRestauracao?: string | null;

  @ApiProperty({
    nullable: true,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  status?: string;
}
