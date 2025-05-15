# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the users management application
RUN npm run users-management:build

# Stage 2: Run the server-side rendered application
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy the build output from the build stage
COPY --from=build /app/dist/apps/users-management /app/dist/apps/users-management

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4200

# Expose the port the app runs on
EXPOSE 4200

# Command to run the application
CMD ["node", "dist/apps/users-management/server/server.mjs"]
