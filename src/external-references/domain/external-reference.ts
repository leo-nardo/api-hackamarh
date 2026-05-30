import { ApiProperty } from '@nestjs/swagger';

export class ExternalReference {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String })
  source: string;

  @ApiProperty({ type: String })
  referenceType: string;

  @ApiProperty({ type: String })
  title: string;

  @ApiProperty({ nullable: true, type: String })
  url?: string | null;

  @ApiProperty({ nullable: true, type: String })
  externalId?: string | null;

  @ApiProperty({ type: String })
  entityType: string;

  @ApiProperty({ type: String })
  entityId: string;

  @ApiProperty({ nullable: true, type: Date })
  capturedAt?: Date | null;

  @ApiProperty({ nullable: true, type: Object })
  metadataJson?: Record<string, unknown> | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
