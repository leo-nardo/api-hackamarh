import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { Point } from 'typeorm/driver/types/GeoJsonTypes';
import { AffectedAreaDto } from '../../affected-areas/dto/affected-area.dto';

export class CreateCollectionPointDto {
  @ApiProperty({ type: () => AffectedAreaDto })
  @ValidateNested()
  @Type(() => AffectedAreaDto)
  @IsNotEmptyObject()
  affectedArea: AffectedAreaDto;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  pointType?: string;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [-48.123, -15.456],
    },
  })
  @IsObject()
  location: Point;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  requiredPhotoCount?: number;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  instructions?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
