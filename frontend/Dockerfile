# --- Stage 1: Build with env vars ---
FROM node:18 AS builder

WORKDIR /app
COPY . .

# Inject env vars from Render at this stage
RUN npm install && npm run build

# --- Stage 2: Serve static build ---
FROM node:18

WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist .

EXPOSE 8080
CMD ["http-server", "-p", "8080"]
