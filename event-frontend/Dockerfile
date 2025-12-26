# Frontend Dockerfile - Multi-stage build for Angular
# Stage 1: Build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the application for production
RUN npm run build -- --configuration production --output-path=dist/event-frontend

# Stage 2: Production - Unprivileged nginx for OpenShift
FROM nginxinc/nginx-unprivileged:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist/event-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (unprivileged)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
