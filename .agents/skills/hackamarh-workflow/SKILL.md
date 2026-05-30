---
name: hackamarh-workflow
description: Use for Hackamarh backend feature work, especially API planning, data modeling, PowerSync/offline sync, photo upload, collection points, schedules, analyst validation, branch workflow, documentation-first changes, and project script/template usage.
---

# Hackamarh Backend Workflow

Use this skill before changing backend features for the Hackamarh MVP.

## 1. Start With The Project Context

Read the smallest useful set of docs before editing:

- `AGENTS.md`
- `project-spec.md`
- `docs/hackamarh-backend.md`
- `docs/readme.md`
- relevant module files under `src/`

For feature planning, also inspect existing migrations, DTOs, entities,
controllers and services related to the feature.

Do not assume MapBiomas, CAR, SIG-CAR, PRAD, CIGMA or Brasil M.A.I.S. are
controlled by this system. Treat them as external sources referenced or
observed by this backend.

## 2. Work On Branches

Before non-trivial edits, check the current branch and status:

```bash
git status --short --branch
```

If the user did not ask to work directly on `main`, create a branch:

```bash
git switch -c codex/<short-feature-name>
```

Use concise branch names, for example:

- `codex/collection-point-photo-api`
- `codex/mission-schedule`
- `codex/affected-area-model`
- `codex/powersync-upload-fixes`

Never discard user work. If the tree is dirty, inspect the diff and work with
the existing changes.

## 3. Use Project Generators First

For new entities or properties, use the `generate` skill and project scripts.
Do not hand-write generated resource structure.

Detect available scripts from `package.json`, then use:

```bash
npm run generate:resource:relational -- --name EntityName
npm run add:property:to-relational -- --name EntityName --property fieldName ...
```

After generation, manually refine only the parts that generators cannot express
well, such as PostGIS geometry columns, custom migrations, PowerSync upload
mapping, indexes and domain-specific validation.

## 4. Prefer Scripts And Existing Templates

Use existing scripts and templates before inventing new flows:

- generators: `.hygen/`
- npm scripts in `package.json`
- migrations under `src/database/migrations`
- Docker Compose files
- existing controller/service/repository/module patterns

For local verification, prefer:

```bash
npm run build
npm run lint
npm test -- --runInBand --passWithNoTests
docker compose --env-file env-example-relational up -d --build
```

If the feature touches PostGIS or runtime behavior, validate with Docker and
real HTTP/database checks when possible.

## 5. Backend Feature Planning Shape

For every feature, identify:

- personas: produtor, tecnico, gestor, analista, auditor, admin
- mobile/offline needs
- backend API endpoints
- database entities and relationships
- PowerSync read/write implications
- file/photo upload path
- validation and audit fields
- demo data needed for frontend

For photo-at-collection-point features, cover:

- how the app gets assigned missions
- how it gets collection points
- how it uploads the image
- how it creates evidence with GPS, timestamp and collection point id
- how the backend checks whether the point is inside the affected area or
  within the collection point radius
- what the analyst sees afterward

## 6. Commit And Push

Before committing, run the relevant checks. At minimum:

```bash
npm run build
npm run lint
```

Then commit focused changes:

```bash
git add <files>
git commit -m "<clear message>"
git push -u origin <branch>
```

If the user asks to continue straight on `main`, push `main`; otherwise push
the feature branch and report the branch name.
