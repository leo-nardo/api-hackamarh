import { ApiPropertyOptional } from '@nestjs/swagger';

export type PowerSyncOperationType = 'PUT' | 'PATCH' | 'DELETE';

export class PowerSyncOperationDto {
  @ApiPropertyOptional({ example: 'PUT' })
  op?: string;

  @ApiPropertyOptional({ example: 'evidence' })
  table?: string;

  @ApiPropertyOptional({ example: '8e1c5de0-9f2c-4ae6-a7bb-97cc980f5a92' })
  id?: string;

  @ApiPropertyOptional({
    example: {
      mission_id: '87c0e92b-830c-48c1-9a22-2cecb4166ba1',
      coordenada: {
        type: 'Point',
        coordinates: [-48.333, -10.184],
      },
      foto_url: 'https://example.com/evidences/photo.jpg',
      timestamp: '2026-05-30T10:00:00.000Z',
      mortalidade_taxa: 0.12,
    },
  })
  data?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'PowerSync CrudEntry opData payload.',
  })
  opData?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'PowerSync CrudEntry op_data payload.',
  })
  op_data?: Record<string, unknown>;
}

export class PowerSyncUploadDto {
  @ApiPropertyOptional({
    type: [PowerSyncOperationDto],
  })
  operations?: PowerSyncOperationDto[];

  @ApiPropertyOptional({
    type: [PowerSyncOperationDto],
    description: 'PowerSync CrudBatch.crud payload.',
  })
  crud?: PowerSyncOperationDto[];
}
