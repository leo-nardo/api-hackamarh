# Generator e2e tests

End-to-end tests for the TypeORM code generators (`npm run generate:resource:relational`, `npm run add:property:to-relational`).

## What's Covered

- Every property `--kind` (primitive, reference, denormalized).
- Every primitive type (string, number, boolean, Date).
- Every reference `--referenceType` (oneToOne, oneToMany, manyToOne, manyToMany).
- `--isAddToDto true | false`, `--isOptional true | false`, `--isNullable true | false` permutations.

## Phases

1. Static checks: runs generators, then `npm run lint`, `npm run build`, then `generators-file-assertions.e2e-spec.ts`.
2. Relational CRUD: boots Nest against PostgreSQL in Docker and exercises generated REST endpoints.

## Running Locally

```bash
npm run test:generators:relational
npm run test:e2e:generators:relational:docker
```

The tracked working tree must be clean because the generator tests create temporary resources under `src/`.

## Layout

```txt
test/generators/
  fixtures/matrix.ts
  helpers/auth.ts
  helpers/exec.ts
  helpers/payloads-relational.ts
  _matrix.sh
  run-static.sh
  run-crud-relational.sh
  startup.relational.test.sh
  generators-file-assertions.e2e-spec.ts
  generators-relational.e2e-spec.ts
  README.md
```
