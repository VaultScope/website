-- Initialize databases for VaultScope Full Stack
-- This script runs once when PostgreSQL container is first created

-- Create database for VaultScope application
CREATE DATABASE vaultscope;

-- Create database for Authentik OIDC provider
CREATE DATABASE authentik;

-- Create application user if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'vaultscope') THEN
      CREATE ROLE vaultscope LOGIN PASSWORD 'vaultscope_dev' SUPERUSER;
   END IF;
END
$$;

-- Grant permissions (postgres user already has all privileges)
GRANT ALL PRIVILEGES ON DATABASE vaultscope TO vaultscope;
