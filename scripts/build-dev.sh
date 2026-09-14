#!/bin/bash
set -e

# VaultScope Development Build Script
# Builds Docker images for local development with test configuration

echo "========================================"
echo " VaultScope Development Build"
echo "========================================"

# Build API
echo -e "\nBuilding API..."
cd VaultScope-API
docker build -t vaultscope-api:dev -t vaultscope-api:latest .
cd ..

# Build Storefront
echo -e "\nBuilding Storefront..."
cd VaultScope
docker build \
    --build-arg VITE_API_URL=http://localhost:8000/api \
    --build-arg VITE_AUTHENTIK_URL=http://localhost:9000 \
    --build-arg VITE_OIDC_CLIENT_ID=vaultscope-storefront \
    --build-arg VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback \
    -t vaultscope-storefront:dev \
    -t vaultscope-storefront:test \
    .
cd ..

# Build Admin
echo -e "\nBuilding Admin..."
cd VaultScope-Admin
docker build \
    --build-arg VITE_API_URL=http://localhost:8000/api \
    --build-arg VITE_AUTHENTIK_URL=http://localhost:9000 \
    --build-arg VITE_OIDC_CLIENT_ID=vaultscope-admin \
    --build-arg VITE_OIDC_REDIRECT_URI=http://localhost:3001/auth/callback \
    -t vaultscope-admin:dev \
    -t vaultscope-admin:test \
    .
cd ..

echo -e "\n========================================"
echo " Development Build Complete!"
echo "========================================"
echo "Images built:"
echo "  - vaultscope-api:dev"
echo "  - vaultscope-storefront:dev"
echo "  - vaultscope-admin:dev"
echo ""
echo "Start development stack with:"
echo "  docker-compose -f docker-compose.full-stack.yml up -d"
echo "========================================"
