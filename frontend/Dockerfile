# ==============================================================================
# STAGE 1: Dependency Installer
# ==============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lock and package files
COPY package.json ./
RUN npm install

# ==============================================================================
# STAGE 2: Code Compiler Builder
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data. Disable during builds
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ==============================================================================
# STAGE 3: Lightweight Production Runner
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root system user for runtime containers
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential public assets
COPY --from=builder /app/public ./public

# Set permissions for pre-compiled cache directories
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built bundles and static folders
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Run Next.js server entry point
CMD ["node", "server.js"]
