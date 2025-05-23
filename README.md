#  Team Polls — Live Polling App

A lightweight Slido-lite app built with Node.js, React (Vite + TypeScript), PostgreSQL, and Redis.

---

## Features

- REST + WebSocket API built with Node.js and Express
- Create polls with custom questions, options, and expiration time
- Cast authenticated votes (anonymous JWT auth)
- Real-time live poll results streaming via WebSocket
- Rate-limit votes to 5/sec per user (burst-safe)
- Polls auto-close at expiration; final tally remains queryable
- Observability with Prometheus metrics endpoint (/metrics)
- Security headers with Helmet and OWASP best practices
- Environment variables for secrets; no secrets in repo

---

## Technologies Used

- **Backend:** Node.js, Express, PostgreSQL, Redis, Jest, Docker
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Docker
- **Testing:** Jest with unit and integration tests hitting containerized DB
- **Containerization:** Docker and Docker Compose
- **Persistence:** PostgreSQL, with explicit schema and SQL migrations (no ORM magic)

---

## Repository Structure

- `/test-poll`  
- `/backend` — Node.js Express API with REST + WebSocket  
- `/frontend` — React Vite + TypeScript frontend app  
- `docker-compose.yml` — Docker Compose file to orchestrate backend, frontend, PostgreSQL, Redis  
- `README.md` — Project documentation (this file)  

---

## Getting Started

Clone the repository and navigate into the project directory:

``bash
- git clone https://github.com/sufairath-nisar/test-poll.git
- cd test-poll

---

## Running Locally with Docker Compose

Start all services (backend, frontend, PostgreSQL, Redis) in one command:

``bash
- docker-compose up --build

- Backend API will be available at http://localhost:4001
- Frontend UI will be available at http://localhost:3000

Stop services with Ctrl+C and clean up containers:
- docker-compose down

---

## Backend (.env.example)
- PG_HOST=postgres_host_name             
- PG_PORT=5432                          
- PG_DATABASE=database_name             
- PG_USER=postgres_user                  
- PG_PASSWORD=postgres_pswd             
- NODE_ENV=development                  
- JWT_SECRET=your_secret_key            
- JWT_EXPIRES_IN=600s                   
- PORT=4000                             

---

## Frontend (.env.example)

- VITE_API_BASE_URL=http://localhost:4001/api          
- VITE_WS_BASE_URL=ws://localhost:4001               

