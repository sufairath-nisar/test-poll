FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run migrations, then start the app
CMD npx knex migrate:latest --env production && npm start
