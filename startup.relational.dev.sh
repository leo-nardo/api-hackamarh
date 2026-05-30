#!/usr/bin/env bash
set -e

if [ -n "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL configured; skipping local postgres wait."
else
  DATABASE_WAIT_HOST="${DATABASE_HOST:-postgres}"
  DATABASE_WAIT_PORT="${DATABASE_PORT:-5432}"
  /opt/wait-for-it.sh "${DATABASE_WAIT_HOST}:${DATABASE_WAIT_PORT}"
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  ./node_modules/.bin/ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=src/database/data-source.ts migration:run
fi

if [ "${RUN_SEEDS:-true}" = "true" ]; then
  npm run seed:run:relational
fi

npm run start:prod
