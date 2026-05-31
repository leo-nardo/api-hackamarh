#!/usr/bin/env bash
set -e

if [ -n "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL configured; skipping local postgres wait."
else
  DATABASE_WAIT_HOST="${DATABASE_HOST:-postgres}"
  DATABASE_WAIT_PORT="${DATABASE_PORT:-5432}"
  /opt/wait-for-it.sh "${DATABASE_WAIT_HOST}:${DATABASE_WAIT_PORT}"
fi

echo "Current directory contents:"
ls -F

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Running migrations from dist (Production mode)..."
  NODE_TLS_REJECT_UNAUTHORIZED=0 node ./node_modules/typeorm/cli.js --dataSource=dist/database/data-source.js migration:run || { echo "Migration failed!"; }
fi

if [ "${RUN_SEEDS:-false}" = "true" ]; then
  echo "Running seeds from dist..."
  NODE_TLS_REJECT_UNAUTHORIZED=0 node dist/database/seeds/relational/run-seed.js || { echo "Seed failed!"; }
fi

echo "Pre-flight checks:"
node -v
ls -R dist | head -n 20

echo "Starting application on port ${PORT:-3000} with global SSL bypass..."
export NODE_TLS_REJECT_UNAUTHORIZED=0
npm run start:prod || { echo "Application crashed with exit code $?"; exit 1; }
