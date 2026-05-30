# Project Specification: Hackamarh MVP (Environmental Monitoring)

## 1. Stack & Context
- Framework: NestJS (based on brocoders/nestjs-boilerplate).
- Database: PostgreSQL with PostGIS extension (CRITICAL for geolocation).
- ORM: TypeORM.
- Architecture: REST API to support an Offline-First Flutter Mobile App using PowerSync.

## 2. Core Entities to Scaffold
1. **User/Tecnico:** Handled by existing auth, but needs an identifier to assign missions.
2. **Mission (Missao PRAD):**
   - `id`: UUID
   - `nome`: String
   - `codigo_car`: String
   - `poligono`: Geometry (Polygon, PostGIS)
   - `tecnico_id`: Relation to User
   - `status`: String (pending, completed)
3. **Evidence (Evidencia/Foto):**
   - `id`: UUID
   - `mission_id`: Relation to Mission
   - `coordenada`: Geometry (Point, PostGIS)
   - `foto_url`: String
   - `timestamp`: Date
   - `mortalidade_taxa`: Number (optional)

## 3. PowerSync Requirements
- PostgreSQL must have `wal_level = logical` enabled in Docker.
- A custom endpoint (`/api/powersync/token`) must be created to issue JWTs based on the authenticated user.
