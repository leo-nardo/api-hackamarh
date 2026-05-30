import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import type { Geometry } from 'typeorm/driver/types/GeoJsonTypes';

export class CreateExternalObservationDto {
  @ApiProperty({ type: String })
  @IsString()
  source: string;

  @ApiProperty({ type: String })
  @IsString()
  observationType: string;

  @ApiProperty({ type: String })
  @IsString()
  entityType: string;

  @ApiProperty({ type: String })
  @IsString()
  entityId: string;

  @ApiProperty({ type: Date })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  observedAt: Date;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  periodStart?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  periodEnd?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  queryParams?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  metrics?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  geom?: Geometry | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  rawPayload?: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true, type: Number })
  @IsOptional()
  @IsNumber()
  confidenceScore?: number | null;
}
