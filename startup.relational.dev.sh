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
  echo "Running migrations with SSL fail-safe..."
  NODE_TLS_REJECT_UNAUTHORIZED=0 ./node_modules/.bin/ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource=src/database/data-source.ts migration:run
fi

if [ -z "${RUN_SEEDS+x}" ]; then
  if [ "${NODE_ENV:-development}" = "production" ]; then
    RUN_SEEDS=false
  else
    RUN_SEEDS=true
  fi
fi

if [ "${RUN_SEEDS}" = "true" ]; then
  echo "Running seeds with SSL fail-safe..."
  NODE_TLS_REJECT_UNAUTHORIZED=0 npm run seed:run:relational
else
  echo "Skipping seed execution."
fi

npm run start:prod
