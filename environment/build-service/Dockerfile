FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port (we'll use environment variable in docker-compose)
EXPOSE ${APP_PORT}

CMD ["npm", "start"]