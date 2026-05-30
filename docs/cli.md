# Command Line Interface (CLI)

Use the project generators to keep modules, DTOs, repositories, and TypeORM entities aligned.

## Generate Resource

```bash
npm run generate:resource:relational -- --name ResourceName
```

Example:

```bash
npm run generate:resource:relational -- --name Category
```

## Add Property

```bash
npm run add:property:to-relational -- --name Category --property name --kind primitive --type string --isAddToDto true --isOptional false --isNullable false
```

Reference properties can point to existing entities such as `User` and `File`.

---

Previous: [Architecture](architecture.md)

Next: [Database](database.md)
