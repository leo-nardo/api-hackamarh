import { ApiProperty } from '@nestjs/swagger';
import type { Geometry } from 'typeorm/driver/types/GeoJsonTypes';

export class ExternalObservation {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  source: string;

  @ApiProperty({ type: String })
  observationType: string;

  @ApiProperty({ type: String })
  entityType: string;

  @ApiProperty({ type: String })
  entityId: string;

  @ApiProperty({ type: Date })
  observedAt: Date;

  @ApiProperty({ nullable: true, type: Date })
  periodStart?: Date | null;

  @ApiProperty({ nullable: true, type: Date })
  periodEnd?: Date | null;

  @ApiProperty({ nullable: true, type: Object })
  queryParams?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: Object })
  metrics?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: Object })
  geom?: Geometry | null;

  @ApiProperty({ nullable: true, type: Object })
  rawPayload?: Record<string, unknown> | null;

  @ApiProperty({ nullable: true, type: Number })
  confidenceScore?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
