# Installing and Running

## Local Setup

1. Copy `env-example-relational` to `.env`.
2. Start infrastructure:

```bash
docker compose up -d postgres maildev
```

3. Install dependencies:

```bash
npm install
```

4. Run migrations and seed data:

```bash
npm run migration:run
npm run seed:run:relational
```

5. Start the API:

```bash
npm run start:dev
```

The API uses PostgreSQL with the PostGIS image in Docker. The default compose file also enables `wal_level=logical` for PowerSync replication.

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
