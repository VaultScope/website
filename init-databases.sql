-- Initialize databases for VaultScope Full Stack
-- This script runs once when PostgreSQL container is first created.
-- Note: Local development defaults below; change password immediately for non-local use.

-- Create least-privilege application role (no SUPERUSER) if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vaultscope') THEN
      CREATE ROLE vaultscope LOGIN PASSWORD 'vaultscope_dev';
   END IF;
END
$$;

-- Create database for VaultScope application owned by vaultscope
CREATE DATABASE vaultscope OWNER vaultscope;

-- Create database for Authentik OIDC provider
CREATE DATABASE authentik;

-- Grant privileges on vaultscope database and schema ownership
GRANT ALL PRIVILEGES ON DATABASE vaultscope TO vaultscope;

\connect vaultscope
ALTER SCHEMA public OWNER TO vaultscope;
