#!/usr/bin/env node

/**
 * VaultScope Standalone Database Setup & Seeding Script
 * 
 * Sets up PostgreSQL database, applies all migrations in order,
 * and seeds comprehensive development/testing data without requiring sqlx-cli.
 * 
 * Usage:
 *   node scripts/setup-db.js [--seed] [--reset]
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'VaultScope-API', 'crates', 'db', 'migrations');
const SEED_FILE = path.join(__dirname, '..', 'seed-data.sql');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

function executePsql(sql, dbName = 'postgres') {
  // Strategy 1: Check if docker container vaultscope-postgres is running
  try {
    const res = spawnSync('docker', ['exec', '-i', 'vaultscope-postgres', 'psql', '-U', 'postgres', '-d', dbName], {
      input: sql,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    if (res.status === 0) {
      return { success: true, output: res.stdout };
    } else if (res.stderr && !res.stderr.includes('already exists')) {
      return { success: false, error: res.stderr };
    }
  } catch (err) {
    // Docker not available or container not running
  }

  // Strategy 2: Try local psql CLI
  try {
    const psqlDb = dbName || 'postgres';
    const res = spawnSync('psql', ['-U', 'postgres', '-d', psqlDb], {
      input: sql,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    if (res.status === 0) {
      return { success: true, output: res.stdout };
    } else {
      return { success: false, error: res.stderr };
    }
  } catch (err) {
    return { success: false, error: 'Neither docker exec nor psql command is available.' };
  }
}

function runSetup() {
  log.info('Running VaultScope Database Setup...');

  // 1. Ensure vaultscope user and database exist
  log.info('Ensuring role "vaultscope" and database "vaultscope" exist...');
  executePsql(`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vaultscope') THEN
        CREATE ROLE vaultscope LOGIN PASSWORD 'vaultscope_dev' SUPERUSER;
      END IF;
    END
    $$;
  `, 'postgres');
  const createDbRes = executePsql('CREATE DATABASE vaultscope;', 'postgres');
  if (createDbRes.success) {
    log.success('Created database "vaultscope".');
  } else {
    log.info('Database "vaultscope" already exists or created.');
  }
  executePsql('GRANT ALL PRIVILEGES ON DATABASE vaultscope TO vaultscope;', 'postgres');

  // 2. Ensure migration tracking table exists
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS _sqlx_migrations (
      version BIGINT PRIMARY KEY,
      description TEXT NOT NULL,
      installed_on TIMESTAMPTZ NOT NULL DEFAULT now(),
      success BOOLEAN NOT NULL,
      checksum BYTEA NOT NULL DEFAULT '\\x',
      execution_time BIGINT NOT NULL DEFAULT 0
    );
  `;
  const trackingRes = executePsql(createTableSql, 'vaultscope');
  if (!trackingRes.success) {
    log.error(`Failed to initialize migration tracking table: ${trackingRes.error}`);
  }

  // 3. Apply migrations in order
  if (fs.existsSync(MIGRATIONS_DIR)) {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    log.info(`Found ${files.length} migration files in ${MIGRATIONS_DIR}`);

    for (const file of files) {
      const match = file.match(/^(\d+)_(.*)\.sql$/);
      if (!match) continue;

      const version = parseInt(match[1], 10);
      const desc = match[2].replace(/_/g, ' ');

      // Check if already applied
      const checkSql = `SELECT success FROM _sqlx_migrations WHERE version = ${version};`;
      const checkRes = executePsql(checkSql, 'vaultscope');
      if (checkRes.success && checkRes.output && checkRes.output.includes('t')) {
        continue;
      }

      log.info(`Applying migration: ${file}...`);
      const migrationSql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      const start = Date.now();
      const applyRes = executePsql(migrationSql, 'vaultscope');

      if (applyRes.success) {
        const duration = Date.now() - start;
        executePsql(`
          INSERT INTO _sqlx_migrations (version, description, success, execution_time)
          VALUES (${version}, '${desc.replace(/'/g, "''")}', true, ${duration})
          ON CONFLICT (version) DO UPDATE SET success = true;
        `, 'vaultscope');
        log.success(`Applied ${file}`);
      } else {
        log.error(`Failed applying ${file}: ${applyRes.error}`);
      }
    }
  }

  // 4. Apply comprehensive seed data
  if (fs.existsSync(SEED_FILE)) {
    log.info('Seeding database with full development data...');
    const seedSql = fs.readFileSync(SEED_FILE, 'utf-8');
    const seedRes = executePsql(seedSql, 'vaultscope');
    if (seedRes.success) {
      log.success('Database seeded successfully!');
    } else {
      log.error(`Database seeding failed: ${seedRes.error}`);
    }
  }

  log.success('Database setup complete!');
}

if (require.main === module) {
  runSetup();
}

module.exports = { runSetup, executePsql };
