FROM node:18 AS builder

WORKDIR /app
COPY . .

ARG VITE_API_BASE_URL
ARG VITE_WS_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_BASE_URL=$VITE_WS_BASE_URL

RUN npm install && npm run build

FROM node:18

WORKDIR /app
RUN npm install -g http-server
COPY --from=builder /app/dist .

EXPOSE 3000
CMD ["http-server", "-p", "3000"]