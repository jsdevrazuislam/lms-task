FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm and build dependencies
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.28.0

# NOTE: This Dockerfile MUST be built from the repository root (context: .)
# Command: docker build -t lms-server -f server/Dockerfile .

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
# Copy server package file
COPY server/package.json ./server/

# Install all dependencies
RUN pnpm install --no-frozen-lockfile

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

# Install pnpm for prod dependencies
RUN npm install -g pnpm@10.28.0

# Better security: Build as non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

# Copy essential files from builder
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/package.json ./
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma

# Install ONLY production dependencies
RUN pnpm install --prod --no-frozen-lockfile

# Set proper ownership
RUN chown -R expressjs:nodejs /app

# Switch to non-root user
USER expressjs

# Expose port
EXPOSE 5000

# Start the server (pointing to the correct compiled path)
WORKDIR /app/server
CMD ["node", "dist/src/server.js"]