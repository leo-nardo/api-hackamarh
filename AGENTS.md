# Project instructions

Hackamarh MVP backend based on `brocoders/nestjs-boilerplate`, now using
NestJS, TypeORM, PostgreSQL/PostGIS and PowerSync-oriented offline sync. MongoDB
and Mongoose were pruned from this project.

## Before backend feature work

Use the `hackamarh-workflow` skill from
[.agents/skills/hackamarh-workflow/SKILL.md](.agents/skills/hackamarh-workflow/SKILL.md).
It documents the branch workflow, documentation-first process, script usage,
PowerSync considerations and the expected planning shape for collection point,
photo upload, schedule, evidence and analyst validation features.

## When adding entities or properties

Use the `generate` skill from
[.agents/skills/generate/SKILL.md](.agents/skills/generate/SKILL.md). It
documents the project's CLI generators (`npm run generate:resource:relational`,
`npm run add:property:to-relational`) which keep DTOs, modules and persistence
structure aligned. Do not hand-write generated entity/resource structure unless
the generator cannot express the required PostGIS, migration or domain-specific
behavior.
