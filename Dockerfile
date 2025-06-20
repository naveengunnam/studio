# Stage 1: Install dependencies
FROM node:20-alpine AS deps
# Install libc6-compat for compatibility with some native Node modules
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./
# Install dependencies using npm ci for clean, reproducible installs
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .

# Build the Next.js application
# The GOOGLE_API_KEY should be available at runtime in the deployed environment, not during build.
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# GOOGLE_API_KEY should be set as an environment variable in your deployment platform.

# Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# # Copy the public folder
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to the non-root user
USER nextjs

# Expose the port Next.js will run on (default 3000, but App Hosting uses $PORT)
# The server.js in standalone output respects the PORT environment variable.
# EXPOSE 3000

# Command to run the Next.js server
# This will use the PORT environment variable provided by the hosting environment (e.g., Firebase App Hosting).
CMD ["node", "server.js"]
