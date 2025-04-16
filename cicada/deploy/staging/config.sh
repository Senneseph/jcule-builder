#!/bin/bash

# CICADA Staging Environment Configuration
# Self-Contained Integrated Continuous Automatic Development, Testing, and Deployment Approach

# Deployment server
DEPLOY_SERVER="staging.example.com"

# Deployment user
DEPLOY_USER="deploy"

# Deployment path
DEPLOY_PATH="/var/www/jcule-builder"

# Environment variables
export NODE_ENV="staging"
export API_URL="https://api.staging.example.com"

# Additional configuration
ENABLE_MONITORING=true
ENABLE_DEBUG=true
