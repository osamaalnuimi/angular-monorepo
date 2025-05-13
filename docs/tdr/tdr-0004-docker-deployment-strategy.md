# TDR-0004: Docker Deployment Strategy

## Status

Implemented

## Summary

This document outlines our approach to containerizing and deploying the World Demographics Visualization application using Docker.

## Problem

Deploying Angular applications consistently across different environments presents several challenges:

1. Ensuring consistent Node.js versions and dependencies across development and production
2. Optimizing build size and performance for production deployment
3. Configuring proper web server settings for an Angular SPA
4. Enabling easy deployment to various hosting platforms
5. Minimizing deployment complexity and potential for human error

## Decision

We will use a multi-stage Docker build process to create optimized production images for the application:

1. First stage: Build the Angular application using Node.js
2. Second stage: Serve the built application using Nginx

This approach separates the build environment from the runtime environment, resulting in smaller final images and better security.

## Implementation Details

### Dockerfile

```dockerfile
# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/apps/angular-case-study /usr/share/nginx/html

# Copy custom nginx configuration if needed
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (Optional)

For SPA routing support, we can add a custom Nginx configuration:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Redirect all requests to index.html for Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
}
```

### Build and Deployment Commands

```bash
# Build the Docker image
docker build -t world-demographics-viz .

# Run the container locally
docker run -p 80:80 world-demographics-viz

# Tag and push to a registry (example)
docker tag world-demographics-viz username/world-demographics-viz:latest
docker push username/world-demographics-viz:latest
```

## Alternatives Considered

### Single-Stage Docker Build

A simpler approach would be to use a single Node.js image that both builds and serves the application. This would be simpler but results in larger images and potential security concerns from including build tools in the production environment.

### Static Hosting Platforms

Deploying directly to static hosting platforms like Netlify, Vercel, or GitHub Pages was considered. While these platforms offer simpler deployment workflows, using Docker provides more flexibility for deployment to various environments and better matches enterprise deployment patterns.

### Server-Side Rendering (SSR)

Angular Universal for server-side rendering was considered but deemed unnecessary for this visualization-focused application where client-side rendering is sufficient.

## Trade-offs

### Advantages

- Smaller production images (typically <30MB vs >1GB for development images)
- Better security by not including build tools and source code in production
- Consistent deployment across different environments
- Nginx provides efficient static file serving and proper SPA routing
- Containerization simplifies CI/CD integration

### Disadvantages

- Additional complexity compared to direct deployment to static hosting
- Requires Docker knowledge for development and operations teams
- Local development workflow differs from production deployment
- Potential challenges with environment-specific configuration

## Dependencies

- Docker
- Nginx
- Node.js (build-time only)

## References

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Configuration for Angular](https://angular.io/guide/deployment#server-configuration)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Docker Hub Nginx Image](https://hub.docker.com/_/nginx)
