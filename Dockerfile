# Multi-stage Dockerfile for EDA Toolbox
# Stage 1: Build the React + TypeScript + Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy full source tree
COPY . .

# Run production build (TypeScript compile + Vite bundle + Tailwind v4)
RUN npm run build

# Stage 2: Serve optimized static files with Nginx Alpine
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built dist files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Provide SPA-friendly fallback routing in Nginx
RUN echo 'server {' \
    'listen 80;' \
    'server_name localhost;' \
    'location / {' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  try_files $uri $uri/ /index.html;' \
    '}' \
    'error_page 500 502 503 504 /50x.html;' \
    'location = /50x.html {' \
    '  root /usr/share/nginx/html;' \
    '}' \
    '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
