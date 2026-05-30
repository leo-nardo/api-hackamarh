# Database

The project uses PostgreSQL through TypeORM. Docker runs `postgis/postgis:15-3.3`, so geospatial columns can use PostGIS geometry types.

## Migrations

Create an empty migration:

```bash
npm run migration:create -- src/database/migrations/MigrationName
```

Generate a migration from entity changes:

```bash
npm run migration:generate -- src/database/migrations/MigrationName
```

Run migrations:

```bash
npm run migration:run
```

Revert the last migration:

```bash
npm run migration:revert
```

## Seeds

Create a seed:

```bash
npm run seed:create:relational -- --name EntityName
```

Run seeds:

```bash
npm run seed:run:relational
```

## Geospatial Data

Mission polygons should use PostGIS `geometry(Polygon, 4326)`.

Evidence coordinates should use PostGIS `geometry(Point, 4326)`.

The `EnablePostgis` migration enables the extension before geospatial tables are created.

---

Previous: [Command Line Interface](cli.md)

Next: [Auth](auth.md)
