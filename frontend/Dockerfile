# # test-herogram/frontend/Dockerfile
# FROM node:18-alpine

# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # Serve the static build with a simple HTTP server
# RUN npm install -g serve
# EXPOSE 3000
# CMD ["serve", "-s", "dist", "-l", "3000"]



# --- Stage 1: Build with env vars ---
FROM node:18 AS builder

WORKDIR /app
COPY . .

# Declare build arguments to accept variables passed during docker build
ARG VITE_API_BASE_URL
ARG VITE_WS_BASE_URL

# Set them as actual environment variables for Vite to use during npm run build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

# Now npm run build will have access to these VITE_ prefixed environment variables
RUN npm install && npm run build

# --- Stage 2: Serve static build ---
FROM node:18

WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist .

EXPOSE 3000
CMD ["http-server", "-p", "3000"]