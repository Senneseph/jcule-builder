#!/bin/bash

# CICADA Initialization Script
# Self-Contained Integrated Continuous Automatic Development, Testing, and Deployment Approach

echo "=========================================================="
echo "  CICADA Initialization"
echo "  Self-Contained Integrated Continuous Automatic"
echo "  Development, Testing, and Deployment Approach"
echo "=========================================================="
echo ""

# Check if running in the correct directory
if [ ! -d "./cicada" ]; then
  echo "Error: This script must be run from the project root directory."
  echo "Please navigate to the project root and run: ./cicada/init/init.sh"
  exit 1
fi

# Create necessary directories if they don't exist
echo "Creating project structure..."
mkdir -p app/src app/docs develop dist

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  echo "node_modules/" > .gitignore
  echo "dist/" >> .gitignore
  echo ".env" >> .gitignore
fi

# Create package.json if it doesn't exist
if [ ! -f "app/package.json" ]; then
  echo "Creating package.json..."
  cat > app/package.json << EOF
{
  "name": "jcule-builder",
  "version": "0.1.0",
  "description": "Visual builder for creating UIs from OpenAPI specifications using jellicule components",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "build": "tsc && vite build",
    "lint": "eslint src"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "eslint": "^8.44.0"
  }
}
EOF
fi

# Create docker-compose.yml if it doesn't exist
if [ ! -f "docker-compose.yml" ]; then
  echo "Creating docker-compose.yml..."
  cat > docker-compose.yml << EOF
version: '3.8'
services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
    ports:
      - "\${APP_PORT:-3000}:3000"
    environment:
      - NODE_ENV=development
      - APP_PORT=3000
    volumes:
      - ./app:/app
      - /app/node_modules
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./app/dist:/usr/share/nginx/html
      - ./develop/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    restart: unless-stopped
EOF
fi

# Create Dockerfile if it doesn't exist
if [ ! -f "app/Dockerfile" ]; then
  echo "Creating Dockerfile..."
  cat > app/Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
EOF
fi

# Create GitHub Actions workflow
mkdir -p .github/workflows
if [ ! -f ".github/workflows/cicada.yml" ]; then
  echo "Creating GitHub Actions workflow..."
  cat > .github/workflows/cicada.yml << EOF
name: CICADA Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: cd app && npm ci
      - name: Run tests
        run: cd app && npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: cd app && npm ci
      - name: Build
        run: cd app && npm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: app/dist

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: app/dist
      - name: Deploy to staging
        run: echo "Deploying to staging..."
        # Add your deployment steps here

  deploy-production:
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build
          path: app/dist
      - name: Deploy to production
        run: echo "Deploying to production..."
        # Add your deployment steps here
EOF
fi

# Create Jest configuration
if [ ! -f "app/jest.config.js" ]; then
  echo "Creating Jest configuration..."
  cat > app/jest.config.js << EOF
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js']
};
EOF
fi

# Create a sample test
mkdir -p app/src/__tests__
if [ ! -f "app/src/__tests__/sample.test.js" ]; then
  echo "Creating sample test..."
  cat > app/src/__tests__/sample.test.js << EOF
describe('Sample Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
EOF
fi

echo ""
echo "CICADA initialization complete!"
echo ""
echo "Next steps:"
echo "1. Navigate to the app directory: cd app"
echo "2. Install dependencies: npm install"
echo "3. Start the development server: npm run dev"
echo "4. Run tests: npm test"
echo ""
echo "For more information, see the CICADA documentation: ./cicada/README.md"
echo ""
