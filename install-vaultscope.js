#!/usr/bin/env node

/**
 * VaultScope CLI Installer
 *
 * Unified installer for all VaultScope components:
 * - VaultScope (website) - Storefront
 * - VaultScope-API (vamos) - Backend API
 * - VaultScope-Admin (camos) - Admin Panel
 *
 * Features:
 * - Standalone database migrations and seeding (no sqlx-cli required)
 * - Clean Authentik exclusion option (default: local mock auth)
 * - Automatic cryptographic secret and key generation
 * - Support for both local development and Docker workflows
 *
 * Usage:
 *   node install-vaultscope.js [options]
 *
 * Options:
 *   --branch=<branch>           Git branch to checkout (default: main)
 *   --components=<list>         all | website | api | admin (default: all)
 *   --skip-deps                 Skip dependency installation
 *   --skip-env                  Skip environment file configuration
 *   --skip-git                  Skip git clone / pull on existing directories
 *   --exclude-authentik         Exclude Authentik & enable local dev auth (default: true)
 *   --with-authentik            Include Authentik integration
 *   --seed                      Run full database seeding (default: true)
 *   --no-seed                   Skip database seeding
 *   -y, --yes                   Non-interactive mode (auto-confirm prompts)
 */

const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

let rl = null;

function getReadline() {
  if (!rl || rl.closed) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return rl;
}

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

// Component definitions
const COMPONENTS = {
  website: {
    name: 'VaultScope Storefront',
    dir: 'VaultScope',
    repo: 'https://github.com/VaultScope/website.git',
    type: 'node',
  },
  api: {
    name: 'VaultScope API (VAMOS)',
    dir: 'VaultScope-API',
    repo: 'https://github.com/VaultScope/vamos.git',
    type: 'rust',
  },
  admin: {
    name: 'VaultScope Admin (CAMOS)',
    dir: 'VaultScope-Admin',
    repo: 'https://github.com/VaultScope/camos.git',
    type: 'node',
  }
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    branch: 'dev', // Default release channel for latest features
    branchExplicit: false,
    components: 'all',
    skipDeps: false,
    skipEnv: false,
    skipGit: false,
    excludeAuthentik: true, // Default to true per system architecture
    seed: true,
    yes: false,
    overwriteEnv: false,
  };

  args.forEach(arg => {
    if (arg.startsWith('--branch=')) {
      options.branch = arg.split('=')[1].trim();
      options.branchExplicit = true;
    } else if (arg === '--dev') {
      options.branch = 'dev';
      options.branchExplicit = true;
    } else if (arg === '--main') {
      options.branch = 'main';
      options.branchExplicit = true;
    } else if (arg.startsWith('--components=')) {
      options.components = arg.split('=')[1];
    } else if (arg === '--skip-deps') {
      options.skipDeps = true;
    } else if (arg === '--skip-env') {
      options.skipEnv = true;
    } else if (arg === '--overwrite-env') {
      options.overwriteEnv = true;
    } else if (arg === '--skip-git' || arg === '--no-git') {
      options.skipGit = true;
    } else if (arg === '--exclude-authentik' || arg === '--no-authentik') {
      options.excludeAuthentik = true;
    } else if (arg === '--with-authentik') {
      options.excludeAuthentik = false;
    } else if (arg === '--seed') {
      options.seed = true;
    } else if (arg === '--no-seed') {
      options.seed = false;
    } else if (arg === '-y' || arg === '--yes' || arg === '--non-interactive') {
      options.yes = true;
    }
  });

  return options;
}

// Execute shell command
function execCommand(command, cwd) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr, stdout });
      } else {
        resolve(stdout);
      }
    });
  });
}

// Check if directory exists
function dirExists(dir) {
  return fs.existsSync(dir);
}

// Ask user a question (or auto-answer if options.yes is true)
function askQuestion(question, options, defaultValue = 'y') {
  if (options && options.yes) {
    return Promise.resolve(defaultValue);
  }
  return new Promise(resolve => {
    try {
      const rlInterface = getReadline();
      rlInterface.question(question, answer => {
        resolve(answer.trim() || defaultValue);
      });
    } catch (e) {
      resolve(defaultValue);
    }
  });
}

// Clone or update repository
async function setupRepository(component, branch, options) {
  const { name, dir, repo } = COMPONENTS[component];

  log.title(`Setting up ${name} (Branch: ${branch})`);

  if (dirExists(dir)) {
    let currentBranch = '';
    let isGit = false;
    try {
      currentBranch = (await execCommand('git rev-parse --abbrev-ref HEAD', dir)).trim();
      isGit = true;
    } catch {
      isGit = false;
    }

    if (options.skipGit || !isGit) {
      log.info(`Directory ${dir} exists${currentBranch ? ` [branch: ${currentBranch}]` : ''}. Skipping git operations (--skip-git enabled).`);
      return;
    }

    log.info(`Directory ${dir} exists [current branch: ${currentBranch || 'unknown'}]. Syncing with release branch: ${branch}...`);
    try {
      await execCommand('git fetch origin --prune', dir);
      if (currentBranch && currentBranch !== branch) {
        log.info(`Switching ${name} from ${currentBranch} to ${branch}...`);
        try {
          await execCommand(`git checkout ${branch}`, dir);
        } catch {
          await execCommand(`git checkout -b ${branch} origin/${branch}`, dir);
        }
      }
      await execCommand(`git pull origin ${branch}`, dir);
      log.success(`Updated ${name} on branch: ${branch}`);
    } catch (err) {
      log.warn(`Could not switch/pull ${name} on branch ${branch}: ${(err.stderr || err.error.message || '').trim()}`);
      log.info(`Continuing with existing files in ${dir}.`);
    }
  } else {
    log.info(`Cloning ${name} (branch: ${branch})...`);
    try {
      await execCommand(`git clone -b ${branch} ${repo} ${dir}`, '.');
      log.success(`Cloned ${name} from branch: ${branch}`);
    } catch (err) {
      log.error(`Failed to clone ${name}: ${(err.stderr || err.error.message || '').trim()}`);
      throw err;
    }
  }
}

// Install dependencies
async function installDependencies(component) {
  const { name, dir, type } = COMPONENTS[component];

  log.info(`Installing dependencies for ${name}...`);

  try {
    if (type === 'node') {
      await execCommand('npm install', dir);
      log.success(`Installed Node.js dependencies for ${name}`);
    } else if (type === 'rust') {
      log.info('Rust dependencies will be fetched on first build (cargo build/run)');
      log.success(`Rust project ready for ${name}`);
    }
  } catch (err) {
    log.error(`Failed to install dependencies for ${name}: ${(err.stderr || err.error.message || '').trim()}`);
    throw err;
  }
}

// Generate or update environment files
async function configureEnvironment(component, options) {
  const { name, dir } = COMPONENTS[component];
  const envPath = path.join(dir, '.env');
  const envExamplePath = path.join(dir, '.env.example');

  log.info(`Configuring environment for ${name}...`);

  // Check if .env already exists
  let overwrite = options.overwriteEnv;
  if (fs.existsSync(envPath) && !overwrite) {
    log.warn(`.env already exists for ${name}`);
    const answer = await askQuestion('Overwrite .env completely? (y/N): ', options, 'n');
    overwrite = answer.toLowerCase() === 'y';
  }

  // Load existing content or start from example template
  let envContent = '';
  if (fs.existsSync(envPath) && !overwrite) {
    envContent = fs.readFileSync(envPath, 'utf-8');
  } else if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf-8');
  }

  // Generate strong cryptographic keys
  const generatedJwtSecret = crypto.randomBytes(64).toString('base64');
  const generatedEncryptionKey = crypto.randomBytes(32).toString('hex');

  function updateEnvVar(content, key, value) {
    const lines = content.split(/\r?\n/);
    let found = false;
    const newLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith(`${key}=`) || trimmed.startsWith(`# ${key}=`) || trimmed.startsWith(`#${key}=`)) {
        found = true;
        return `${key}=${value}`;
      }
      return line;
    });
    if (!found) {
      newLines.push(`${key}=${value}`);
    }
    return newLines.filter((l, i, arr) => !(l === '' && i === arr.length - 1)).join('\n') + '\n';
  }

  if (component === 'api') {
    envContent = updateEnvVar(envContent, 'DATABASE_URL', 'postgres://vaultscope:vaultscope_dev@localhost:5432/vaultscope');
    envContent = updateEnvVar(envContent, 'DB_MAX_CONNECTIONS', '10');
    envContent = updateEnvVar(envContent, 'HOST', '0.0.0.0');
    envContent = updateEnvVar(envContent, 'PORT', '3000');
    envContent = updateEnvVar(envContent, 'JWT_SECRET', generatedJwtSecret);
    envContent = updateEnvVar(envContent, 'ENCRYPTION_KEY', generatedEncryptionKey);
    envContent = updateEnvVar(envContent, 'REDIS_URL', 'redis://localhost:6379');
    envContent = updateEnvVar(envContent, 'CORS_ORIGINS', 'http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:3001');

    if (options.excludeAuthentik) {
      envContent = updateEnvVar(envContent, 'AUTHENTIK_ENABLED', 'false');
      envContent = updateEnvVar(envContent, 'AUTH_MODE', 'local');
      envContent = updateEnvVar(envContent, 'AUTHENTIK_ISSUER', 'http://localhost:3000/api/auth/mock');
      envContent = updateEnvVar(envContent, 'AUTHENTIK_CLIENT_ID_ADMIN', 'vaultscope-admin');
      envContent = updateEnvVar(envContent, 'AUTHENTIK_CLIENT_SECRET_ADMIN', 'dev-mock-admin-secret');
      envContent = updateEnvVar(envContent, 'AUTHENTIK_CLIENT_ID_STOREFRONT', 'vaultscope-storefront');
      envContent = updateEnvVar(envContent, 'AUTHENTIK_CLIENT_SECRET_STOREFRONT', 'dev-mock-storefront-secret');
    }
  } else if (component === 'website') {
    envContent = updateEnvVar(envContent, 'VITE_API_URL', 'http://localhost:3000/api');
    if (options.excludeAuthentik) {
      envContent = updateEnvVar(envContent, 'VITE_AUTHENTIK_URL', 'http://localhost:3000/api/auth/mock');
      envContent = updateEnvVar(envContent, 'VITE_OIDC_CLIENT_ID', 'vaultscope-storefront');
      envContent = updateEnvVar(envContent, 'VITE_OIDC_REDIRECT_URI', 'http://localhost:5174/auth/callback');
    }
  } else if (component === 'admin') {
    envContent = updateEnvVar(envContent, 'VITE_API_URL', 'http://localhost:3000/api');
    if (options.excludeAuthentik) {
      envContent = updateEnvVar(envContent, 'VITE_AUTHENTIK_URL', 'http://localhost:3000/api/auth/mock');
      envContent = updateEnvVar(envContent, 'VITE_OIDC_CLIENT_ID', 'vaultscope-admin');
      envContent = updateEnvVar(envContent, 'VITE_OIDC_REDIRECT_URI', 'http://localhost:5173/auth/callback');
    }
  }

  fs.writeFileSync(envPath, envContent.trim() + '\n', 'utf-8');
  log.success(`Configured .env for ${name}`);
}

// Run database setup, migrations and seeding
async function runDatabaseSetup(options) {
  log.title('🗄️  Database Setup & Migrations');

  const answer = await askQuestion('Run database migrations and seeding now? (Y/n): ', options, 'y');
  if (answer.toLowerCase() !== 'y') {
    log.info('Skipping database setup. You can run it anytime with:');
    log.info('  node scripts/setup-db.js');
    return;
  }

  try {
    const setupScriptPath = path.join(__dirname, 'scripts', 'setup-db.js');
    if (fs.existsSync(setupScriptPath)) {
      log.info('Executing setup-db.js...');
      const { runSetup } = require(setupScriptPath);
      runSetup();
      log.success('Database migrations and seeding completed successfully.');
    } else {
      log.warn(`Setup script not found at ${setupScriptPath}. Attempting sqlx fallback...`);
      await execCommand('sqlx database create && sqlx migrate run', path.join('VaultScope-API', 'crates', 'db'));
      log.success('Database migrations completed via sqlx.');
    }
  } catch (err) {
    log.error(`Database setup failed: ${err.message || err.stderr || err}`);
    log.info('Ensure PostgreSQL is running on localhost:5432 (e.g. docker compose up -d postgres)');
    log.info('You can retry database setup manually with: node scripts/setup-db.js');
  }
}

// Display post-installation next steps & login info
function displayNextSteps(components, options) {
  log.title('✨ Installation Complete!');

  console.log(`${colors.bright}VaultScope Services Overview:${colors.reset}\n`);

  if (components.includes('api') || components === 'all') {
    console.log(`${colors.cyan}VaultScope API (VAMOS):${colors.reset}`);
    console.log('  Directory: VaultScope-API');
    console.log('  Start:     cd VaultScope-API && cargo run');
    console.log('  URL:       http://localhost:3000  (Docker mapped: http://localhost:8000)');
    console.log('  Health:    http://localhost:3000/api/health\n');
  }

  if (components.includes('website') || components === 'all') {
    console.log(`${colors.cyan}VaultScope Storefront:${colors.reset}`);
    console.log('  Directory: VaultScope');
    console.log('  Start:     cd VaultScope && npm run dev');
    console.log('  URL:       http://localhost:5174  (Docker mapped: http://localhost:3000)\n');
  }

  if (components.includes('admin') || components === 'all') {
    console.log(`${colors.cyan}VaultScope Admin (CAMOS):${colors.reset}`);
    console.log('  Directory: VaultScope-Admin');
    console.log('  Start:     cd VaultScope-Admin && npm run dev');
    console.log('  URL:       http://localhost:5173  (Docker mapped: http://localhost:3001)\n');
  }

  if (options.excludeAuthentik) {
    console.log(`${colors.bright}${colors.green}Authentication Mode: Local / Mock (Authentik Excluded)${colors.reset}`);
    console.log('  Authentik is cleanly bypassed with direct dev login and mock OIDC redirection.\n');
    console.log('  Staff Accounts (Admin Panel - 1-Click Dev Login):');
    console.log('    • Owner:     admin1@test.local    (Full permissions: *)');
    console.log('    • Support:   support1@test.local  (Support role)');
    console.log('    • Billing:   billing1@test.local  (Billing role)');
    console.log('    • Tech:      tech1@test.local     (Technical role)');
    console.log('\n  Customer Accounts (Storefront):');
    console.log('    • Customer:  customer1@test.local (Anton Schmidt)\n');
    console.log('  Direct Dev Login API:');
    console.log('    POST http://localhost:3000/api/auth/dev-login');
    console.log('    Body: { "persona": "admin1" }\n');
  }

  console.log(`${colors.bright}Release Channel:${colors.reset} ${colors.green}${options.branch}${colors.reset} (Synchronized across all components)\n`);

  console.log(`${colors.gray}Run full stack via Docker (Authentik excluded by default):`);
  console.log(`  docker compose -f VaultScope/docker-compose.full-stack.yml up -d${colors.reset}\n`);
}

// Main installation flow
async function main() {
  log.title('🚀 VaultScope CLI Installer');

  const options = parseArgs();

  // Unified release channel / branch selection across all repositories
  if (!options.branchExplicit && !options.yes) {
    console.log(`${colors.bright}Release Channel / Branch Selection:${colors.reset}`);
    console.log(`  ${colors.green}1) dev${colors.reset}  - Latest active development (Recommended; required for upcoming updates)`);
    console.log(`  ${colors.blue}2) main${colors.reset} - Production stable releases\n`);
    console.log(`${colors.gray}  Note: Branch is selected globally for all components because updates across`);
    console.log(`  Storefront, API, and Admin are coupled and may not be published to main simultaneously.${colors.reset}\n`);

    const branchChoice = await askQuestion('Select branch [1=dev / 2=main] (default: dev): ', options, 'dev');
    if (branchChoice === '2' || branchChoice.toLowerCase() === 'main') {
      options.branch = 'main';
    } else {
      options.branch = 'dev';
    }
    log.info(`Using release branch: ${colors.bright}${options.branch}${colors.reset}\n`);
  }

  console.log(`Branch:           ${options.branch} (unified)`);
  console.log(`Components:       ${options.components}`);
  console.log(`Exclude Authentik:${options.excludeAuthentik}`);
  console.log(`Seed Database:    ${options.seed}`);
  console.log(`Skip Dependencies:${options.skipDeps}`);
  console.log(`Skip Git:         ${options.skipGit}\n`);

  // Determine which components to install
  let componentsToInstall = [];
  if (options.components === 'all') {
    componentsToInstall = ['api', 'website', 'admin'];
  } else {
    componentsToInstall = options.components.split(',').map(s => s.trim());
  }

  // Validate components
  for (const comp of componentsToInstall) {
    if (!COMPONENTS[comp]) {
      log.error(`Unknown component: ${comp}`);
      log.info('Valid components: website, api, admin, all');
      process.exit(1);
    }
  }

  try {
    // 1. Setup repos and dependencies for each component
    for (const component of componentsToInstall) {
      await setupRepository(component, options.branch, options);

      if (!options.skipDeps) {
        await installDependencies(component);
      }

      if (!options.skipEnv) {
        await configureEnvironment(component, options);
      }
    }

    // 2. Database migrations and seeding (if API is selected)
    if (componentsToInstall.includes('api')) {
      await runDatabaseSetup(options);
    }

    // 3. Post-install instructions
    displayNextSteps(options.components, options);

  } catch (error) {
    log.error('Installation encountered an error:');
    console.error(error);
    process.exit(1);
  } finally {
    if (rl) {
      rl.close();
    }
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log.error(`Uncaught error: ${error.message}`);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log.error(error.message);
    process.exit(1);
  });
}

module.exports = { main };
