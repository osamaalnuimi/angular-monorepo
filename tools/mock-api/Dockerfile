# Use Node.js as the base image
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the mock API files
COPY tools/mock-api /app/tools/mock-api

# Expose the port the mock API runs on
EXPOSE 3000

# Command to run the mock API server
CMD ["npx", "json-server", "--watch", "tools/mock-api/db.json", "--port", "3000", "--host", "0.0.0.0", "--middlewares", "tools/mock-api/auth-middleware.js"]
