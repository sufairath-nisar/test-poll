FROM node:18-alpine

WORKDIR /app

# Copy package.json and install deps first (cache efficiency)
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build for production (make sure .env exists)
RUN npm run build

# Install a lightweight static server
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
