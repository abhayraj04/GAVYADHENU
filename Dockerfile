# Multi-Stage Production Dockerfile for Gavyadhenu Commercial Platform
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copy application source
COPY . .

# Build Vite client and bundled Node.js server
RUN pnpm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install production essentials
RUN addgroup -S gavyadhenu && adduser -S gavyadhenu -G gavyadhenu

# Copy built artifacts and public static assets
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/public ./client/public
COPY --from=builder /app/node_modules ./node_modules

# Assign permissions to non-root user
USER gavyadhenu

EXPOSE 3000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/healthz || exit 1

CMD ["node", "dist/index.js"]
