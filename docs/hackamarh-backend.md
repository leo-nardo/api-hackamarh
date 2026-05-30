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

Storage:

- Local upload remains the safe default for development.
- S3-compatible upload now supports a custom endpoint through
  `AWS_S3_ENDPOINT`, which allows Cloudflare R2.
- For R2, use `AWS_S3_REGION=auto`, `AWS_S3_FORCE_PATH_STYLE=true` and
  `AWS_DEFAULT_S3_BUCKET=<bucket-name>`.

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
- Current domain branch adds the property, affected area, collection point,
  schedule, external reference/observation and PRAD versioning model.

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

The MVP now separates information controlled by this system from external
records such as CAR, SIG-CAR, PRAD documents, MapBiomas and Brasil M.A.I.S.

Core tables:

- `property`: rural property/CAR anchor, with `car_code`, owner metadata and
  optional PostGIS `geom`.
- `property_user`: links producers, representatives, technicians or analysts
  to a property.
- `restoration_plan`: PRAD/restoration planning container for a property.
- `restoration_plan_version`: flexible PRAD/proposal versions from technician,
  producer, official import or other source.
- `affected_area`: one property can have many affected/restoration polygons.
- `collection_point`: required GPS points for field photo evidence.
- `mission`: work order assigned to a user, usually tied to one affected area.
- `mission_schedule`: date/time window and deadline for the mission.
- `evidence`: photo/GPS/form evidence captured in the field.
- `external_reference`: generic external traceability record, e.g. link,
  screenshot, document or API identifier.
- `external_observation`: structured external observation/query result from
  MapBiomas or similar sources.

Existing `user`, `role`, `status` and auth tables are kept from the boilerplate.

Spatial fields:

- `property.geom`: `geometry(Polygon, 4326)`.
- `affected_area.geom`: `geometry(Polygon, 4326)`.
- `collection_point.location`: `geometry(Point, 4326)`.
- `evidence.coordenada`: `geometry(Point, 4326)`.
- `external_observation.geom`: generic `geometry(Geometry, 4326)`.

Important migrations:

- `1780086341403-CreateEnvironmentalMonitoring.ts`: initial `mission` and
  `evidence` tables.
- `1780090000000-ExpandEnvironmentalDomain.ts`: full domain model, PostGIS
  indexes, schedule, collection points and external reference/observation
  support.

Backward compatibility note: `mission.codigo_car`, `mission.poligono`,
`evidence.coordenada`, `evidence.foto_url`, `evidence.timestamp` and
`evidence.mortalidade_taxa` remain compatible with the first PowerSync shape.

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

R2-compatible storage variables:

```env
FILE_DRIVER=s3
ACCESS_KEY_ID=<cloudflare-r2-access-key-id>
SECRET_ACCESS_KEY=<cloudflare-r2-secret-access-key>
AWS_S3_REGION=auto
AWS_DEFAULT_S3_BUCKET=arara-bucket
AWS_S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
AWS_S3_FORCE_PATH_STYLE=true
```

Do not commit real database URLs or storage keys. Use local `.env` or the
deployment platform's secret manager.

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
  "property_id": "4d2e6a90-01c7-4697-bb74-c4f9a7364d62",
  "collection_point_id": "153ecc3f-d273-40ec-85fa-022a3b278888",
  "latitude": -10.184,
  "longitude": -48.333,
  "altitude": 219.4,
  "foto_url": "https://example.com/evidences/photo.jpg",
  "timestamp": "2026-05-30T10:00:00.000Z",
  "device_model": "Samsung Galaxy A54",
  "status": "pending",
  "mortalidade_taxa": 0.12
}
```

The backend accepts top-level latitude/longitude or point coordinates in this
shape:

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

The backend also accepts `location`, `captured_at`, `capturedAt`,
`mortality_rate`, `mortalityRate`, `deviceModel`, `device_id` and `deviceId`
aliases. Evidence uploaded through PowerSync defaults `technician_id` to the
authenticated user and `status` to `pending`. `validation_status` remains
accepted as a legacy upload alias, but the canonical backend column is now
`status`.

## 7. Mobile API

The first app-facing endpoint for the Flutter team is:

```http
GET /api/mobile/missions
Authorization: Bearer <app_jwt>
```

It returns assigned missions with schedule, property, affected area polygon and
collection points:

```json
[
  {
    "id": "d19175a0-f7d1-4f9b-9c07-1d743f0e6e4f",
    "status": "scheduled",
    "name": "Coleta PRAD - APP Nascente Sul",
    "objective": "Coletar fotos georreferenciadas dos pontos definidos.",
    "property": {
      "id": "4d2e6a90-01c7-4697-bb74-c4f9a7364d62",
      "carCode": "TO-DEMO-0001",
      "name": "Fazenda Demo Hackamarh"
    },
    "affectedArea": {
      "id": "0fae0d8a-961c-459d-85af-9f278508a208",
      "name": "APP Nascente Sul",
      "geom": {
        "type": "Polygon",
        "coordinates": []
      }
    },
    "collectionPoints": [
      {
        "id": "153ecc3f-d273-40ec-85fa-022a3b278888",
        "name": "Ponto 1 - Borda oeste",
        "location": {
          "type": "Point",
          "coordinates": [-48.332, -10.1848]
        },
        "radiusMeters": 30,
        "requiredPhotoCount": 1
      }
    ]
  }
]
```

Demo seed data is created idempotently for `john.doe@example.com / secret`.

## 8. Flutter Connector Expectations

The Flutter PowerSync connector should:

1. Authenticate normally against the NestJS auth endpoints.
2. Call `GET /api/powersync/token` with the app Bearer token.
3. Return the received PowerSync token and `POWERSYNC_URL` to the PowerSync SDK.
4. In `uploadData()`, call `database.getCrudBatch()`.
5. Send `batch.crud` to `POST /api/powersync/data`.
6. Call `batch.complete()` only after the backend responds successfully.

The mobile app should use client-generated UUIDs for rows created offline.

Suggested local SQLite/PowerSync tables for the first photo flow:

- `mission`
- `affected_area`
- `collection_point`
- `mission_schedule`
- `evidence`

Column names should match the backend-friendly snake_case names:

- `codigo_car`
- `tecnico_id`
- `mission_id`
- `property_id`
- `collection_point_id`
- `foto_url`
- `latitude`
- `longitude`
- `altitude`
- `device_model`
- `mortalidade_taxa`
- `status`

The backend also accepts common camelCase aliases, but matching snake_case
reduces mapping friction.

## 9. Verification Already Run

The following checks passed after the implementation:

```bash
npm run build
npm run lint
npm test -- --runInBand --passWithNoTests
docker compose --env-file env-example-relational up -d --build
```

`jest` reported no tests found, which is expected at this stage. The Docker
verification executed migrations, ran seeds and started the NestJS app.

Smoke checks run:

- `POST /api/v1/auth/email/login`
- `GET /api/mobile/missions`
- `GET /api/powersync/token`
- `POST /api/powersync/data` with one evidence write

## 10. Current Gaps

Items still worth doing before the demo:

- Add PowerSync sync rules or Sync Streams configuration.
- Decide whether photos are uploaded directly through the existing file module
  before evidence rows are synced.
- Add integration tests for PowerSync upload routes.
- Add a small Flutter connector example once the mobile repo is ready.
- Decide production-style JWT signing strategy for PowerSync, especially JWKS
  if the project goes beyond the hackathon MVP.

## 11. Useful Files

- `project-spec.md`
- `docker-compose.yaml`
- `env-example-relational`
- `src/powersync/powersync.controller.ts`
- `src/powersync/powersync.service.ts`
- `src/powersync/dto/powersync-upload.dto.ts`
- `src/mobile/mobile.controller.ts`
- `src/mobile/mobile.service.ts`
- `src/missions/infrastructure/persistence/relational/entities/mission.entity.ts`
- `src/evidence/infrastructure/persistence/relational/entities/evidence.entity.ts`
- `src/database/migrations/1780086341403-CreateEnvironmentalMonitoring.ts`
- `src/database/migrations/1780090000000-ExpandEnvironmentalDomain.ts`
