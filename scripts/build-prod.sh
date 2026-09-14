#!/bin/bash
set -e

# VaultScope Production Build Script
# Builds Docker images for production deployment with proper versioning

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VERSION=${1:-$(git describe --tags --always --dirty 2>/dev/null || echo "dev")}
REGISTRY=${REGISTRY:-ghcr.io/vaultscope}

# Load production environment if available
if [ -f .env.production ]; then
    echo -e "${GREEN}Loading production environment...${NC}"
    set -a
    source .env.production
    set +a
else
    echo -e "${YELLOW}Warning: .env.production not found${NC}"
    echo "Using defaults from .env.production.example"
fi

# Validate required variables
REQUIRED_VARS=(
    "VITE_API_URL"
    "VITE_AUTHENTIK_URL"
    "VITE_OIDC_CLIENT_ID_ADMIN"
    "VITE_OIDC_CLIENT_ID_STOREFRONT"
    "VITE_OIDC_REDIRECT_URI_ADMIN"
    "VITE_OIDC_REDIRECT_URI_STOREFRONT"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: ${var} not set${NC}"
        echo "Please set it in .env.production or environment"
        exit 1
    fi
done

echo "========================================"
echo " VaultScope Production Build"
echo "========================================"
echo "Version: ${VERSION}"
echo "Registry: ${REGISTRY}"
echo "API URL: ${VITE_API_URL}"
echo "========================================"

# Build API
echo -e "\n${GREEN}Building API...${NC}"
cd VaultScope-API
docker build \
    --platform linux/amd64 \
    --tag ${REGISTRY}/vaultscope-api:${VERSION} \
    --tag ${REGISTRY}/vaultscope-api:latest \
    .
cd ..

# Build Storefront
echo -e "\n${GREEN}Building Storefront...${NC}"
cd VaultScope
docker build \
    --platform linux/amd64 \
    --build-arg VITE_API_URL=${VITE_API_URL} \
    --build-arg VITE_AUTHENTIK_URL=${VITE_AUTHENTIK_URL} \
    --build-arg VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID_STOREFRONT} \
    --build-arg VITE_OIDC_REDIRECT_URI=${VITE_OIDC_REDIRECT_URI_STOREFRONT} \
    --tag ${REGISTRY}/vaultscope-storefront:${VERSION} \
    --tag ${REGISTRY}/vaultscope-storefront:latest \
    .
cd ..

# Build Admin
echo -e "\n${GREEN}Building Admin...${NC}"
cd VaultScope-Admin
docker build \
    --platform linux/amd64 \
    --build-arg VITE_API_URL=${VITE_API_URL} \
    --build-arg VITE_AUTHENTIK_URL=${VITE_AUTHENTIK_URL} \
    --build-arg VITE_OIDC_CLIENT_ID=${VITE_OIDC_CLIENT_ID_ADMIN} \
    --build-arg VITE_OIDC_REDIRECT_URI=${VITE_OIDC_REDIRECT_URI_ADMIN} \
    --tag ${REGISTRY}/vaultscope-admin:${VERSION} \
    --tag ${REGISTRY}/vaultscope-admin:latest \
    .
cd ..

echo -e "\n${GREEN}========================================"
echo " Build Complete!"
echo "========================================"
echo "Images built:"
echo "  - ${REGISTRY}/vaultscope-api:${VERSION}"
echo "  - ${REGISTRY}/vaultscope-storefront:${VERSION}"
echo "  - ${REGISTRY}/vaultscope-admin:${VERSION}"
echo ""
echo "To push to registry:"
echo "  docker push ${REGISTRY}/vaultscope-api:${VERSION}"
echo "  docker push ${REGISTRY}/vaultscope-storefront:${VERSION}"
echo "  docker push ${REGISTRY}/vaultscope-admin:${VERSION}"
echo "=======================================${NC}"
