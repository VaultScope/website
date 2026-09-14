-- Initialize databases for VaultScope Full Stack
-- This script runs once when PostgreSQL container is first created

-- Create database for VaultScope application
CREATE DATABASE vaultscope;

-- Create database for Authentik OIDC provider
CREATE DATABASE authentik;

-- Grant permissions (postgres user already has all privileges)
-- Additional users can be created here if needed
