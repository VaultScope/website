# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# Declare build-time environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_LISTMONK_URL
ENV VITE_LISTMONK_URL=$VITE_LISTMONK_URL
ARG VITE_LISTMONK_LIST_UUID
ENV VITE_LISTMONK_LIST_UUID=$VITE_LISTMONK_LIST_UUID
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

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
