#!/bin/bash

# CICADA Deployment Script
# Self-Contained Integrated Continuous Automatic Development, Testing, and Deployment Approach

# Default environment is staging
ENVIRONMENT=${1:-staging}

echo "=========================================================="
echo "  CICADA Deployment Process"
echo "  Self-Contained Integrated Continuous Automatic"
echo "  Development, Testing, and Deployment Approach"
echo "=========================================================="
echo ""
echo "Deploying to $ENVIRONMENT environment..."
echo ""

# Check if running in the correct directory
if [ ! -d "./cicada" ]; then
  echo "Error: This script must be run from the project root directory."
  echo "Please navigate to the project root and run: ./cicada/deploy/deploy.sh [environment]"
  exit 1
fi

# Check if dist directory exists
if [ ! -d "./dist" ]; then
  echo "Error: Dist directory not found."
  echo "Please run the build script first: ./cicada/build/build.sh"
  exit 1
fi

# Check if environment is valid
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
  echo "Error: Invalid environment. Must be 'staging' or 'production'."
  exit 1
fi

# Load environment-specific configuration
if [ -f "./cicada/deploy/$ENVIRONMENT/config.sh" ]; then
  source "./cicada/deploy/$ENVIRONMENT/config.sh"
else
  echo "Error: Environment configuration not found."
  echo "Please create a configuration file: ./cicada/deploy/$ENVIRONMENT/config.sh"
  exit 1
fi

# Check if required variables are set
if [ -z "$DEPLOY_SERVER" ] || [ -z "$DEPLOY_PATH" ]; then
  echo "Error: Required deployment variables not set."
  echo "Please check your configuration file: ./cicada/deploy/$ENVIRONMENT/config.sh"
  exit 1
fi

# Deploy to the specified environment
echo "Deploying to $DEPLOY_SERVER:$DEPLOY_PATH..."

# Example deployment using rsync (uncomment and modify as needed)
# rsync -avz --delete ./dist/ $DEPLOY_USER@$DEPLOY_SERVER:$DEPLOY_PATH

# Example deployment using Docker (uncomment and modify as needed)
# docker-compose -f docker-compose.$ENVIRONMENT.yml up -d

# For demonstration purposes, we'll just echo the deployment
echo "Simulating deployment of ./dist/ to $DEPLOY_SERVER:$DEPLOY_PATH"

echo ""
echo "Deployment to $ENVIRONMENT completed successfully!"
echo ""
