# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm and build dependencies
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.28.0

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# Copy server package file
COPY server/package.json ./server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy server source code and prisma
COPY server/ ./server/

# Generate Prisma client
RUN pnpm --filter server exec prisma generate

# Build TypeScript
RUN pnpm --filter server run build

# Stage 2: Production
FROM node:20-alpine AS runner

# Set production environment
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm to handle prod dependencies
RUN npm install -g pnpm@10.28.0

# Better security: Build as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy built files and root files for pnpm
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma

# Install production dependencies only using pnpm deploy logic or simple filter
# We'll use a safer approach for monorepo: just install prod deps for the server
RUN pnpm install --prod --frozen-lockfile

# Set proper ownership
RUN chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Start the server
WORKDIR /app/server
CMD ["node", "dist/server.js"]
