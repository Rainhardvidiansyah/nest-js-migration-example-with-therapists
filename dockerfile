
# syntax=docker/dockerfile:1

# Stage 1: build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY yarn.lock package-lock.json* ./
RUN if [ -f yarn.lock ]; then \
			yarn install --frozen-lockfile --production=false; \
		elif [ -f package-lock.json ]; then \
			npm ci; \
		else \
			npm install; \
		fi

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: production image
FROM node:18-alpine AS runner
WORKDIR /app

# If you use a specific user, create it (optional)
RUN addgroup -S nest && adduser -S nest -G nest

# Copy only needed files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production deps
RUN if [ -f package-lock.json ]; then npm ci --only=production; elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; fi

USER nest

ENV NODE_ENV=production
EXPOSE 3000

# Default command
CMD ["node", "dist/main.js"]
