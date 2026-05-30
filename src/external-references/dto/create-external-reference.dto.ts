import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateExternalReferenceDto {
  @ApiProperty({ type: String })
  @IsString()
  source: string;

  @ApiProperty({ type: String })
  @IsString()
  referenceType: string;

  @ApiProperty({ type: String })
  @IsString()
  title: string;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  url?: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @ApiProperty({ type: String })
  @IsString()
  entityType: string;

  @ApiProperty({ type: String })
  @IsString()
  entityId: string;

  @ApiPropertyOptional({ nullable: true, type: Date })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  capturedAt?: Date | null;

  @ApiPropertyOptional({ nullable: true, type: Object })
  @IsOptional()
  @IsObject()
  metadataJson?: Record<string, unknown> | null;
}
