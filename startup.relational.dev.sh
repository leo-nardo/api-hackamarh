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
  echo "Running migrations from dist..."
  node ./node_modules/typeorm/cli.js --dataSource=dist/database/data-source.js migration:run
fi

if [ "${RUN_SEEDS:-false}" = "true" ]; then
  echo "Running seeds from dist..."
  node dist/database/seeds/relational/run-seed.js
fi

npm run start:prod
