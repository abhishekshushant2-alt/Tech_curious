# Multi-stage production build for Tech Curious
# 1. Build Frontend
FROM node:22-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# 2. Build Backend
FROM node:22-alpine AS server-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

# 3. Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy built server and production node_modules
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY --from=server-builder /app/server/dist ./server/dist
COPY --from=client-builder /app/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 5000

USER node
CMD ["node", "dist/server.js"]
