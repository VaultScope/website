# Build stage
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci

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
RUN npm run build

# Production stage
FROM caddy:2-alpine
RUN addgroup -g 10001 -S caddy \
    && adduser -u 10001 -S -G caddy -H -D caddy \
    && mkdir -p /data/caddy /config/caddy /srv \
    && chown -R caddy:caddy /data /config
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
ENV PORT=3000 \
    XDG_DATA_HOME=/data \
    XDG_CONFIG_HOME=/config
USER caddy

HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=20s \
    CMD wget --spider -q http://127.0.0.1:3000 || exit 1

EXPOSE 3000
