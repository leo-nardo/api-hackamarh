# Architecture

The project keeps the boilerplate's hexagonal shape while using PostgreSQL as the only persistence adapter.

## Module Structure

```txt
.
├── domain
│   └── [DOMAIN_ENTITY].ts
├── dto
│   ├── create.dto.ts
│   ├── find-all.dto.ts
│   └── update.dto.ts
├── infrastructure
│   └── persistence
│       ├── relational
│       │   ├── entities
│       │   │   └── [ENTITY].ts
│       │   ├── mappers
│       │   │   └── [MAPPER].ts
│       │   ├── relational-persistence.module.ts
│       │   └── repositories
│       │       └── [ADAPTER].repository.ts
│       └── [PORT].repository.ts
├── controller.ts
├── module.ts
└── service.ts
```

`[DOMAIN_ENTITY].ts` represents business data and is independent from database details.

`[ENTITY].ts` represents the PostgreSQL table shape used by TypeORM.

`[MAPPER].ts` converts database entities to domain entities and back.

`[PORT].repository.ts` defines persistence operations; `[ADAPTER].repository.ts` implements them with TypeORM.

---

Previous: [Installing and Running](installing-and-running.md)

Next: [Command Line Interface](cli.md)
