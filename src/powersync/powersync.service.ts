import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type ms from 'ms';
import { DataSource, EntityManager } from 'typeorm';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { AllConfigType } from '../config/config.type';
import {
  PowerSyncOperationDto,
  PowerSyncOperationType,
  PowerSyncUploadDto,
} from './dto/powersync-upload.dto';

type NormalizedPowerSyncOperation = {
  op: PowerSyncOperationType;
  table: 'mission' | 'evidence';
  id: string;
  data: Record<string, unknown>;
};

type PowerSyncUploadResult = {
  index: number;
  op?: string;
  table?: string;
  id?: string;
  status: 'applied' | 'rejected';
  reason?: string;
};

type ColumnMapping = {
  column: string;
  sourceKeys: string[];
  geometry?: 'Point' | 'Polygon';
};

@Injectable()
export class PowersyncService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async createToken(user: JwtPayloadType): Promise<{
    token: string;
    powersyncUrl?: string;
    userId: string;
  }> {
    const expiresIn =
      process.env.POWERSYNC_JWT_EXPIRES_IN ??
      this.configService.getOrThrow('auth.expires', {
        infer: true,
      });
    const secret =
      process.env.POWERSYNC_JWT_SECRET ??
      this.configService.getOrThrow('auth.secret', { infer: true });

    const token = await this.jwtService.signAsync(
      {
        sub: String(user.id),
        userId: user.id,
        role: user.role,
        sessionId: user.sessionId,
      },
      {
        audience:
          process.env.POWERSYNC_JWT_AUDIENCE ?? process.env.POWERSYNC_URL,
        expiresIn: expiresIn as ms.StringValue,
        keyid: process.env.POWERSYNC_JWT_KEY_ID,
        secret,
      },
    );

    return {
      token,
      powersyncUrl: process.env.POWERSYNC_URL,
      userId: String(user.id),
    };
  }

  async upload(
    body: PowerSyncUploadDto | PowerSyncOperationDto | PowerSyncOperationDto[],
    user: JwtPayloadType,
    defaults?: Partial<Pick<PowerSyncOperationDto, 'op' | 'table' | 'id'>>,
  ): Promise<{ ok: true; results: PowerSyncUploadResult[] }> {
    const operations = this.extractOperations(body, defaults);
    const results = await this.dataSource.transaction(async (manager) => {
      const uploadResults: PowerSyncUploadResult[] = [];

      for (const [index, operation] of operations.entries()) {
        const normalized = this.normalizeOperation(operation, user);

        if ('reason' in normalized) {
          uploadResults.push({
            index,
            op: operation.op,
            table: operation.table,
            id: operation.id,
            status: 'rejected',
            reason: normalized.reason,
          });
          continue;
        }

        await this.applyOperation(manager, normalized);
        uploadResults.push({
          index,
          op: normalized.op,
          table: normalized.table,
          id: normalized.id,
          status: 'applied',
        });
      }

      return uploadResults;
    });

    return { ok: true, results };
  }

  private extractOperations(
    body: PowerSyncUploadDto | PowerSyncOperationDto | PowerSyncOperationDto[],
    defaults?: Partial<Pick<PowerSyncOperationDto, 'op' | 'table' | 'id'>>,
  ): PowerSyncOperationDto[] {
    const bodyWithOperations = body as PowerSyncUploadDto;
    const operations = (Array.isArray(body) && body) ||
      bodyWithOperations.operations ||
      bodyWithOperations.crud || [body as PowerSyncOperationDto];

    return operations.map((operation) => ({
      ...operation,
      ...this.removeUndefined(defaults ?? {}),
    }));
  }

  private normalizeOperation(
    operation: PowerSyncOperationDto,
    user: JwtPayloadType,
  ): NormalizedPowerSyncOperation | { reason: string } {
    const op = this.normalizeOperationType(operation.op);
    const table = this.normalizeTable(operation.table);
    const data = this.extractOperationData(operation);
    const id = String(operation.id ?? data.id ?? '');

    if (!op) {
      return { reason: 'Unsupported operation. Use PUT, PATCH or DELETE.' };
    }

    if (!table) {
      return { reason: 'Unsupported table. Use mission or evidence.' };
    }

    if (!id) {
      return { reason: 'Missing row id.' };
    }

    return {
      op,
      table,
      id,
      data: this.withUserFallback(table, data, user),
    };
  }

  private extractOperationData(
    operation: PowerSyncOperationDto,
  ): Record<string, unknown> {
    if (operation.opData) {
      return operation.opData;
    }

    if (operation.op_data) {
      return operation.op_data;
    }

    if (operation.data) {
      return operation.data;
    }

    const looseData = { ...operation } as Record<string, unknown>;

    delete looseData.op;
    delete looseData.table;
    delete looseData.data;
    delete looseData.opData;
    delete looseData.op_data;

    return looseData;
  }

  private normalizeOperationType(op?: string): PowerSyncOperationType | null {
    const value = op?.toUpperCase();

    if (value === 'PUT' || value === 'PATCH' || value === 'DELETE') {
      return value;
    }

    return null;
  }

  private normalizeTable(table?: string): 'mission' | 'evidence' | null {
    const value = table?.toLowerCase();

    if (value === 'mission' || value === 'missions') {
      return 'mission';
    }

    if (value === 'evidence' || value === 'evidences') {
      return 'evidence';
    }

    return null;
  }

  private withUserFallback(
    table: 'mission' | 'evidence',
    data: Record<string, unknown>,
    user: JwtPayloadType,
  ): Record<string, unknown> {
    if (table === 'mission') {
      return {
        tecnico_id: user.id,
        created_by: user.id,
        priority: 'normal',
        status: 'scheduled',
        ...data,
      };
    }

    return {
      technician_id: user.id,
      submitted_at: new Date().toISOString(),
      status: 'pending',
      ...data,
    };
  }

  private async applyOperation(
    manager: EntityManager,
    operation: NormalizedPowerSyncOperation,
  ): Promise<void> {
    if (operation.op === 'DELETE') {
      await manager.query(`DELETE FROM "${operation.table}" WHERE "id" = $1`, [
        operation.id,
      ]);
      return;
    }

    const values = this.mapColumns(operation.table, operation.data);

    if (operation.op === 'PATCH') {
      await this.patchRow(manager, operation, values);
      return;
    }

    await this.upsertRow(manager, operation, values);
  }

  private async upsertRow(
    manager: EntityManager,
    operation: NormalizedPowerSyncOperation,
    values: Map<string, unknown>,
  ): Promise<void> {
    values.set('id', operation.id);

    const params: unknown[] = [];
    const columns = [...values.keys()];
    const valueExpressions = columns.map((column) =>
      this.toSqlValueExpression(
        operation.table,
        column,
        values.get(column),
        params,
      ),
    );
    const updateColumns = columns.filter((column) => column !== 'id');
    const updates = updateColumns.map(
      (column) => `"${column}" = EXCLUDED."${column}"`,
    );

    updates.push(`"updatedAt" = now()`);

    await manager.query(
      `INSERT INTO "${operation.table}" (${columns
        .map((column) => `"${column}"`)
        .join(
          ', ',
        )}) VALUES (${valueExpressions.join(', ')}) ON CONFLICT ("id") DO UPDATE SET ${updates.join(
        ', ',
      )}`,
      params,
    );
  }

  private async patchRow(
    manager: EntityManager,
    operation: NormalizedPowerSyncOperation,
    values: Map<string, unknown>,
  ): Promise<void> {
    if (values.size === 0) {
      return;
    }

    const params: unknown[] = [];
    const updates = [...values.entries()].map(([column, value]) => {
      return `"${column}" = ${this.toSqlValueExpression(
        operation.table,
        column,
        value,
        params,
      )}`;
    });

    params.push(operation.id);
    updates.push(`"updatedAt" = now()`);

    await manager.query(
      `UPDATE "${operation.table}" SET ${updates.join(', ')} WHERE "id" = $${
        params.length
      }`,
      params,
    );
  }

  private mapColumns(
    table: 'mission' | 'evidence',
    data: Record<string, unknown>,
  ): Map<string, unknown> {
    const mappings = this.getColumnMappings(table);
    const values = new Map<string, unknown>();

    for (const mapping of mappings) {
      let value = this.firstDefined(data, mapping.sourceKeys);

      if (
        value === undefined &&
        table === 'evidence' &&
        mapping.column === 'coordenada'
      ) {
        value = this.pointFromLatitudeLongitude(data);
      }

      if (value !== undefined) {
        values.set(mapping.column, value);
      }
    }

    return values;
  }

  private getColumnMappings(table: 'mission' | 'evidence'): ColumnMapping[] {
    if (table === 'mission') {
      return [
        { column: 'nome', sourceKeys: ['nome', 'name'] },
        { column: 'codigo_car', sourceKeys: ['codigo_car', 'codigoCar'] },
        {
          column: 'affected_area_id',
          sourceKeys: ['affected_area_id', 'affectedAreaId'],
        },
        { column: 'objective', sourceKeys: ['objective', 'objetivo'] },
        {
          column: 'poligono',
          sourceKeys: ['poligono', 'polygon'],
          geometry: 'Polygon',
        },
        {
          column: 'tecnico_id',
          sourceKeys: [
            'tecnico_id',
            'tecnicoId',
            'assigned_to',
            'assignedTo',
            'assignedToId',
            'technicianId',
          ],
        },
        {
          column: 'created_by',
          sourceKeys: ['created_by', 'createdBy', 'createdById'],
        },
        { column: 'status', sourceKeys: ['status'] },
        { column: 'priority', sourceKeys: ['priority', 'prioridade'] },
        { column: 'due_date', sourceKeys: ['due_date', 'dueDate'] },
      ];
    }

    return [
      { column: 'mission_id', sourceKeys: ['mission_id', 'missionId'] },
      { column: 'property_id', sourceKeys: ['property_id', 'propertyId'] },
      {
        column: 'collection_point_id',
        sourceKeys: ['collection_point_id', 'collectionPointId'],
      },
      {
        column: 'technician_id',
        sourceKeys: [
          'technician_id',
          'technicianId',
          'tecnico_id',
          'tecnicoId',
        ],
      },
      {
        column: 'coordenada',
        sourceKeys: [
          'coordenada',
          'location',
          'coordinate',
          'coordinates',
          'gps',
        ],
        geometry: 'Point',
      },
      {
        column: 'altitude',
        sourceKeys: ['altitude', 'altitude_meters', 'altitudeMeters'],
      },
      { column: 'foto_url', sourceKeys: ['foto_url', 'fotoUrl', 'photoUrl'] },
      {
        column: 'timestamp',
        sourceKeys: ['timestamp', 'captured_at', 'capturedAt'],
      },
      {
        column: 'submitted_at',
        sourceKeys: ['submitted_at', 'submittedAt'],
      },
      {
        column: 'device_model',
        sourceKeys: ['device_model', 'deviceModel', 'device_id', 'deviceId'],
      },
      {
        column: 'mortalidade_taxa',
        sourceKeys: [
          'mortalidade_taxa',
          'mortalidadeTaxa',
          'mortality_rate',
          'mortalityRate',
        ],
      },
      {
        column: 'fase_sucessional',
        sourceKeys: ['fase_sucessional', 'faseSucessional'],
      },
      {
        column: 'metodo_restauracao',
        sourceKeys: ['metodo_restauracao', 'metodoRestauracao'],
      },
      { column: 'notes', sourceKeys: ['notes', 'observacao', 'observations'] },
      {
        column: 'status',
        sourceKeys: ['status', 'validation_status', 'validationStatus'],
      },
      {
        column: 'validation_reason',
        sourceKeys: ['validation_reason', 'validationReason'],
      },
      {
        column: 'validated_by',
        sourceKeys: ['validated_by', 'validatedBy', 'validatedById'],
      },
      {
        column: 'validated_at',
        sourceKeys: ['validated_at', 'validatedAt'],
      },
    ];
  }

  private toSqlValueExpression(
    table: 'mission' | 'evidence',
    column: string,
    value: unknown,
    params: unknown[],
  ): string {
    const mapping = this.getColumnMappings(table).find(
      (candidate) => candidate.column === column,
    );

    if (mapping?.geometry) {
      const normalizedGeometry = this.normalizeGeometry(
        value,
        mapping.geometry,
      );
      params.push(JSON.stringify(normalizedGeometry));
      return `ST_SetSRID(ST_GeomFromGeoJSON($${params.length}), 4326)`;
    }

    params.push(value);
    return `$${params.length}`;
  }

  private normalizeGeometry(
    value: unknown,
    type: 'Point' | 'Polygon',
  ): Record<string, unknown> {
    let geometry: Record<string, unknown>;

    if (typeof value === 'string') {
      geometry = JSON.parse(value) as Record<string, unknown>;
    } else if (Array.isArray(value)) {
      geometry = { type, coordinates: value };
    } else if (
      type === 'Point' &&
      value &&
      typeof value === 'object' &&
      ('latitude' in value || 'lat' in value) &&
      ('longitude' in value || 'lng' in value)
    ) {
      const coordinate = value as Record<string, unknown>;
      geometry = {
        type,
        coordinates: [
          coordinate.longitude ?? coordinate.lng,
          coordinate.latitude ?? coordinate.lat,
        ],
      };
    } else {
      geometry = value as Record<string, unknown>;
    }

    if (
      type === 'Polygon' &&
      Array.isArray(geometry.coordinates) &&
      this.isCoordinatePair(geometry.coordinates[0])
    ) {
      geometry.coordinates = [geometry.coordinates];
    }

    return geometry;
  }

  private isCoordinatePair(value: unknown): value is [number, number] {
    return (
      Array.isArray(value) &&
      value.length >= 2 &&
      typeof value[0] === 'number' &&
      typeof value[1] === 'number'
    );
  }

  private pointFromLatitudeLongitude(
    data: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    const latitude = this.toNumber(
      this.firstDefined(data, ['latitude', 'lat']),
    );
    const longitude = this.toNumber(
      this.firstDefined(data, ['longitude', 'lng']),
    );

    if (latitude === undefined || longitude === undefined) {
      return undefined;
    }

    return {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  private toNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : undefined;
    }

    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : undefined;
    }

    return undefined;
  }

  private firstDefined(
    data: Record<string, unknown>,
    sourceKeys: string[],
  ): unknown {
    for (const sourceKey of sourceKeys) {
      if (data[sourceKey] !== undefined) {
        return data[sourceKey];
      }
    }

    return undefined;
  }

  private removeUndefined<T extends Record<string, unknown>>(
    value: T,
  ): Partial<T> {
    return Object.fromEntries(
      Object.entries(value).filter(
        ([, entryValue]) => entryValue !== undefined,
      ),
    ) as Partial<T>;
  }
}
