# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Declare build-time environment variables
ARG VITE_API_URL
ARG VITE_AUTHENTIK_URL
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_REDIRECT_URI

# Make them available to Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTHENTIK_URL=$VITE_AUTHENTIK_URL
ENV VITE_OIDC_CLIENT_ID=$VITE_OIDC_CLIENT_ID
ENV VITE_OIDC_REDIRECT_URI=$VITE_OIDC_REDIRECT_URI

COPY . .
RUN npx vite build

# Production stage
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
    CMD wget --spider -q http://localhost:3000 || exit 1

EXPOSE 3000
