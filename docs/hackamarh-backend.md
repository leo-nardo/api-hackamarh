# Hackamarh Backend Documentation

This document records the backend work completed for the Hackamarh MVP and
the integration points expected by the Flutter offline-first app.

## 1. Project Direction

The backend is based on `brocoders/nestjs-boilerplate` and was adapted for an
environmental monitoring MVP focused on PRAD missions, field evidence and
offline synchronization.

Chosen stack:

- NestJS REST API.
- PostgreSQL with PostGIS.
- TypeORM.
- Docker Compose for local infrastructure.
- PowerSync-compatible endpoints for offline-first mobile sync.

The current domain targets the hackathon's restoration and degraded-area
monitoring scenario:

- A manager creates or assigns restoration monitoring missions.
- A field technician receives assigned missions on the mobile app.
- The technician captures GPS evidence, photos and basic indicators offline.
- When connectivity returns, the app uploads local writes to this API.
- PowerSync reads PostgreSQL changes and syncs the canonical state back to
  devices.

## 2. Repository Initialization

The original Git history was reset for this project repository and pushed to:

`https://github.com/leo-nardo/api-hackamarh.git`

Important commits:

- `0ddbc29 first commit`: initial README commit.
- `3775c83 add project scaffold`: boilerplate adapted for Hackamarh.
- `04c8716 add powersync upload endpoints`: PowerSync token and upload support.

## 3. Boilerplate Pruning

The Brocoders boilerplate originally supported both relational and document
database variants. The Hackamarh MVP now uses only PostgreSQL/TypeORM.

Removed or disabled:

- Mongoose and MongoDB dependencies.
- Document database configuration and Docker Compose files.
- Document persistence modules, schemas and repositories.
- Document generator templates and document generator tests.
- Generic home/example module that was not needed for auth or the MVP domain.

Kept:

- Authentication and user modules.
- Relational TypeORM persistence.
- File upload infrastructure.
- Swagger.
- Existing auth guards and JWT strategy.
- Relational seeds and migrations.

## 4. Infrastructure Changes

Docker was changed to use PostGIS instead of plain PostgreSQL.

Database image:

```yaml
image: postgis/postgis:15-3.3
```

Logical WAL is enabled for PowerSync replication:

```yaml
command: postgres -c wal_level=logical
```

Updated Compose files:

- `docker-compose.yaml`
- `docker-compose.relational.test.yaml`
- `docker-compose.relational.ci.yaml`
- `docker-compose.generators-relational.test.yaml`

TypeORM is configured with extension installation enabled:

```ts
installExtensions: true
```

The initial user migration also creates:

- `uuid-ossp`
- `postgis`

## 5. Domain Model

### Mission

File:

`src/missions/infrastructure/persistence/relational/entities/mission.entity.ts`

Database table:

`mission`

Fields:

- `id`: UUID primary key.
- `nome`: mission name.
- `codigo_car`: CAR code.
- `poligono`: PostGIS `geometry(Polygon, 4326)`.
- `tecnico_id`: relation to existing `user` table.
- `status`: mission status, default `pending`.
- `createdAt` and `updatedAt`.

### Evidence

File:

`src/evidence/infrastructure/persistence/relational/entities/evidence.entity.ts`

Database table:

`evidence`

Fields:

- `id`: UUID primary key.
- `mission_id`: relation to `mission`.
- `coordenada`: PostGIS `geometry(Point, 4326)`.
- `foto_url`: photo URL.
- `timestamp`: field capture date/time.
- `mortalidade_taxa`: optional numeric mortality indicator.
- `createdAt` and `updatedAt`.

### Migration

File:

`src/database/migrations/1780086341403-CreateEnvironmentalMonitoring.ts`

Creates:

- `mission` table.
- `evidence` table.
- Foreign keys.
- GiST indexes for spatial columns.
- Indexes for `tecnico_id` and `mission_id`.

## 6. PowerSync Integration

PowerSync requires two backend responsibilities in this MVP:

- Issue a JWT to the authenticated mobile user.
- Receive offline writes from the mobile app and apply them synchronously to
  PostgreSQL.

The API uses the existing NestJS JWT auth guard. All PowerSync routes require a
Bearer token from the normal application auth flow.

### Token Endpoint

Endpoint:

```http
GET /api/powersync/token
Authorization: Bearer <app_jwt>
```

Response:

```json
{
  "token": "<powersync_jwt>",
  "powersyncUrl": "https://example.powersync.com",
  "userId": "1"
}
```

The PowerSync token includes:

- `sub`: authenticated user id.
- `userId`: authenticated user id.
- `role`: existing user role payload.
- `sessionId`: existing auth session id.
- `aud`: from `POWERSYNC_JWT_AUDIENCE` or `POWERSYNC_URL`.
- `kid`: from `POWERSYNC_JWT_KEY_ID`, when configured.

Environment variables:

```env
POWERSYNC_JWT_SECRET=secret
POWERSYNC_JWT_EXPIRES_IN=15m
POWERSYNC_JWT_AUDIENCE=powersync
POWERSYNC_JWT_KEY_ID=hackamarh-dev
POWERSYNC_URL=
```

For the hackathon MVP this uses HS256/shared-secret signing through Nest's
`JwtService`. For production, asymmetric keys and JWKS should be considered.

### Upload Endpoints

Batch endpoints:

```http
POST /api/powersync/data
POST /api/powersync/upload
```

Single-operation endpoints:

```http
PUT /api/powersync/data
PATCH /api/powersync/data
DELETE /api/powersync/data
```

Table-specific single-operation endpoints:

```http
PUT /api/powersync/data/:table
PATCH /api/powersync/data/:table
DELETE /api/powersync/data/:table/:id
```

Allowed table names:

- `mission`
- `missions`
- `evidence`
- `evidences`

The upload service rejects unknown tables instead of allowing arbitrary SQL.

### Batch Payload

The batch endpoint accepts either `operations` or PowerSync-style `crud`.

```json
{
  "crud": [
    {
      "op": "PUT",
      "table": "evidence",
      "id": "8e1c5de0-9f2c-4ae6-a7bb-97cc980f5a92",
      "opData": {
        "mission_id": "87c0e92b-830c-48c1-9a22-2cecb4166ba1",
        "coordenada": {
          "type": "Point",
          "coordinates": [-48.333, -10.184]
        },
        "foto_url": "https://example.com/evidences/photo.jpg",
        "timestamp": "2026-05-30T10:00:00.000Z",
        "mortalidade_taxa": 0.12
      }
    }
  ]
}
```

Response:

```json
{
  "ok": true,
  "results": [
    {
      "index": 0,
      "op": "PUT",
      "table": "evidence",
      "id": "8e1c5de0-9f2c-4ae6-a7bb-97cc980f5a92",
      "status": "applied"
    }
  ]
}
```

Validation or unsupported operations return HTTP `200` with per-operation
`rejected` results. This avoids blocking the PowerSync client upload queue on
domain validation errors. Temporary infrastructure/database failures should
still surface as server errors so the client can retry.

### Mission Upsert Example

```http
PUT /api/powersync/data/mission
Authorization: Bearer <app_jwt>
Content-Type: application/json
```

```json
{
  "id": "87c0e92b-830c-48c1-9a22-2cecb4166ba1",
  "nome": "Monitoramento PRAD Fazenda Exemplo",
  "codigo_car": "TO-1234567",
  "poligono": {
    "type": "Polygon",
    "coordinates": [
      [
        [-48.335, -10.18],
        [-48.331, -10.18],
        [-48.331, -10.185],
        [-48.335, -10.185],
        [-48.335, -10.18]
      ]
    ]
  },
  "status": "pending"
}
```

If `tecnico_id` is omitted for a mission upload, the backend defaults it to the
authenticated user id.

### Evidence Upsert Example

```http
PUT /api/powersync/data/evidence
Authorization: Bearer <app_jwt>
Content-Type: application/json
```

```json
{
  "id": "8e1c5de0-9f2c-4ae6-a7bb-97cc980f5a92",
  "mission_id": "87c0e92b-830c-48c1-9a22-2cecb4166ba1",
  "coordenada": {
    "type": "Point",
    "coordinates": [-48.333, -10.184]
  },
  "foto_url": "https://example.com/evidences/photo.jpg",
  "timestamp": "2026-05-30T10:00:00.000Z",
  "mortalidade_taxa": 0.12
}
```

The backend also accepts point coordinates in this shape:

```json
{
  "coordenada": {
    "latitude": -10.184,
    "longitude": -48.333
  }
}
```

Internally, GeoJSON is written to PostGIS with:

```sql
ST_SetSRID(ST_GeomFromGeoJSON(...), 4326)
```

## 7. Flutter Connector Expectations

The Flutter PowerSync connector should:

1. Authenticate normally against the NestJS auth endpoints.
2. Call `GET /api/powersync/token` with the app Bearer token.
3. Return the received PowerSync token and `POWERSYNC_URL` to the PowerSync SDK.
4. In `uploadData()`, call `database.getCrudBatch()`.
5. Send `batch.crud` to `POST /api/powersync/data`.
6. Call `batch.complete()` only after the backend responds successfully.

The mobile app should use client-generated UUIDs for rows created offline.

Suggested local SQLite/PowerSync tables:

- `mission`
- `evidence`

Column names should match the backend-friendly snake_case names:

- `codigo_car`
- `tecnico_id`
- `mission_id`
- `foto_url`
- `mortalidade_taxa`

The backend also accepts common camelCase aliases, but matching snake_case
reduces mapping friction.

## 8. Verification Already Run

The following checks passed after the implementation:

```bash
node node_modules/typescript/bin/tsc -p tsconfig.build.json --noEmit
node node_modules/eslint/bin/eslint.js "{src,apps,libs,test}/**/*.ts"
node node_modules/jest/bin/jest.js --runInBand --passWithNoTests
```

`jest` reported no tests found, which is expected at this stage.

## 9. Current Gaps

Items still worth doing before the demo:

- Create seed data for one technician, missions and evidence examples.
- Add PowerSync sync rules or Sync Streams configuration.
- Decide whether photos are uploaded directly through the existing file module
  before evidence rows are synced.
- Add integration tests for PowerSync upload routes.
- Add a small Flutter connector example once the mobile repo is ready.
- Decide production-style JWT signing strategy for PowerSync, especially JWKS
  if the project goes beyond the hackathon MVP.

## 10. Useful Files

- `project-spec.md`
- `docker-compose.yaml`
- `env-example-relational`
- `src/powersync/powersync.controller.ts`
- `src/powersync/powersync.service.ts`
- `src/powersync/dto/powersync-upload.dto.ts`
- `src/missions/infrastructure/persistence/relational/entities/mission.entity.ts`
- `src/evidence/infrastructure/persistence/relational/entities/evidence.entity.ts`
- `src/database/migrations/1780086341403-CreateEnvironmentalMonitoring.ts`
