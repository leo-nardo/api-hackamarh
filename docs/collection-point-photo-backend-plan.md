# Collection Point Photo Backend Plan

This is the near-term backend plan for the Flutter team feature: a user goes to
a collection point, takes a photo and sends the evidence.

## Goal

Support this mobile flow:

1. Technician logs in.
2. App downloads assigned missions.
3. App shows affected area polygon and required collection points.
4. Technician goes to a collection point.
5. App captures photo, GPS location and timestamp.
6. App stores the evidence offline.
7. When online, app uploads the photo file.
8. App syncs the evidence row through PowerSync upload.
9. Backend stores evidence and marks it for analyst review.

## MVP Backend Scope

Implement only what the app needs for the first usable loop:

- assigned missions for the authenticated technician;
- affected area polygon per mission;
- collection points per affected area;
- photo upload using existing file infrastructure;
- evidence creation/update through PowerSync upload;
- basic validation fields for analyst review.

Do not implement full MapBiomas automation in this step. External data can be
linked later through `external_reference` / `external_observation`.

## Required Data Model

Keep existing boilerplate `user`.

Current entities already exist:

- `Mission`
- `Evidence`

Add or evolve toward:

- `Property`
- `AffectedArea`
- `CollectionPoint`
- `MissionSchedule`

Minimum relationships:

```text
Property 1:N AffectedArea
AffectedArea 1:N CollectionPoint
AffectedArea 1:N Mission
Mission 1:1 MissionSchedule
Mission 1:N Evidence
CollectionPoint 1:N Evidence
User 1:N Mission as assigned technician
User 1:N Evidence as capturing technician
```

## App-Facing API Contract

### Login

Already available:

```http
POST /api/v1/auth/email/login
```

Seed users:

```text
admin@example.com / secret
john.doe@example.com / secret
```

### PowerSync Token

Already available:

```http
GET /api/powersync/token
Authorization: Bearer <app_jwt>
```

### Assigned Missions

Recommended endpoint:

```http
GET /api/mobile/missions
Authorization: Bearer <app_jwt>
```

Response shape:

```json
[
  {
    "id": "mission-uuid",
    "status": "scheduled",
    "objective": "Coletar evidencias da APP Nascente Sul",
    "schedule": {
      "startsAt": "2026-05-30T08:00:00.000Z",
      "endsAt": "2026-05-30T18:00:00.000Z",
      "deadlineAt": "2026-05-31T12:00:00.000Z"
    },
    "property": {
      "id": "property-uuid",
      "carCode": "TO-DEMO-0001",
      "name": "Fazenda Demo"
    },
    "affectedArea": {
      "id": "area-uuid",
      "name": "APP Nascente Sul",
      "geom": {
        "type": "Polygon",
        "coordinates": []
      }
    },
    "collectionPoints": [
      {
        "id": "point-uuid",
        "name": "Ponto 1",
        "pointType": "foto_campo",
        "location": {
          "type": "Point",
          "coordinates": [-48.333, -10.184]
        },
        "radiusMeters": 30,
        "instructions": "Tirar foto olhando para a area restaurada.",
        "requiredPhotoCount": 1
      }
    ]
  }
]
```

For the first version, this endpoint can be REST-only. Later, the same data can
be delivered through PowerSync sync rules.

### Photo Upload

Use existing file upload module:

```http
POST /api/v1/files/upload
Authorization: Bearer <app_jwt>
Content-Type: multipart/form-data
```

The Flutter app should:

1. keep photo locally while offline;
2. upload photo when online;
3. store the returned URL/path in `evidence.photo_url`;
4. sync the evidence row with PowerSync.

Binary images should not be sent through PowerSync CRUD rows.

### Evidence Upload Through PowerSync

Already available:

```http
POST /api/powersync/data
Authorization: Bearer <app_jwt>
```

Batch payload:

```json
{
  "crud": [
    {
      "op": "PUT",
      "table": "evidence",
      "id": "client-generated-uuid",
      "opData": {
        "mission_id": "mission-uuid",
        "collection_point_id": "point-uuid",
        "coordenada": {
          "latitude": -10.184,
          "longitude": -48.333
        },
        "foto_url": "/api/v1/files/evidence-photo.jpg",
        "timestamp": "2026-05-30T10:00:00.000Z",
        "notes": "Foto coletada no ponto definido."
      }
    }
  ]
}
```

Backend now stores `collection_point_id`, `notes`, `altitude`, `device_model`
and analyst validation fields on `Evidence`.

## Backend Validation Rules

When an evidence row arrives, backend should eventually compute:

- point inside affected area polygon;
- point within collection point radius;
- captured_at inside mission schedule window or before deadline;
- authenticated user is assigned to the mission;
- photo_url exists;
- evidence is pending analyst validation.

Suggested evidence validation fields:

```text
status: pending | approved | rejected | needs_review
validation_reason
validated_by
validated_at
```

For the first implementation, set `status = pending` and store reason text only
when automatic validation fails. `sync_status` should remain local to the
Flutter/PowerSync client and should not be treated as the backend evidence
analysis status.

## Implementation Steps

1. Create branch:

```bash
git switch -c codex/collection-point-photo-api
```

2. Use project generators for new resources:

```bash
npm run generate:resource:relational -- --name Property
npm run generate:resource:relational -- --name AffectedArea
npm run generate:resource:relational -- --name CollectionPoint
npm run generate:resource:relational -- --name MissionSchedule
```

3. Add fields through `npm run add:property:to-relational`.

4. Manually refine PostGIS columns and migrations.

5. Add app-facing mobile endpoint:

```text
src/mobile/mobile.controller.ts
src/mobile/mobile.service.ts
```

6. Update PowerSync upload mapping for new `evidence` fields.

7. Add seed/demo data:

- one property;
- one affected area;
- two collection points;
- one scheduled mission assigned to `john.doe@example.com`.

8. Verify:

```bash
npm run build
npm run lint
npm test -- --runInBand --passWithNoTests
docker compose --env-file env-example-relational up -d --build
```

9. Test with HTTP:

- login;
- get PowerSync token;
- fetch `/api/mobile/missions`;
- upload photo;
- upload evidence batch.

## Notes For Flutter

The mobile app should generate UUIDs for offline-created evidence rows.

Required local evidence fields:

```text
id
mission_id
collection_point_id
property_id
latitude
longitude
altitude
foto_url
timestamp/captured_at
device_model
status
notes
sync state local-only
```

Local-only fields such as upload retry state, local photo path and sync status
belong in the Flutter/SQLite layer, not necessarily in PostgreSQL.
