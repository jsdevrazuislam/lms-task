# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.28.0

COPY package.json pnpm-lock.yaml* ./
COPY server/package.json ./server/

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN npx prisma generate --schema=./server/prisma/schema.prisma

RUN pnpm --filter server run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/dist ./dist 
COPY --from=builder /app/server/prisma ./prisma 

EXPOSE 5000

CMD ["node", "dist/server.js"]