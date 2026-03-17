# ==========================================
# Stage 1: Dependency Installation
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency graphs
COPY package.json package-lock.json ./
# Install dependencies cleanly omitting optional deps that might fail
RUN npm ci

# ==========================================
# Stage 2: Application Builder
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetry disable (optional, speeds up build)
ENV NEXT_TELEMETRY_DISABLED=1

# Pass in public variables required for Next.js build-time static generation
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run the next.js production build process
RUN npm run build

# ==========================================
# Stage 3: Production Runner
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root system user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the public directory (static assets)
COPY --from=builder /app/public ./public

# Setup permissions for the pre-renderer cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy the Next.js standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch over to the unprivileged user
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Execute the auto-generated standalone server component
CMD ["node", "server.js"]
