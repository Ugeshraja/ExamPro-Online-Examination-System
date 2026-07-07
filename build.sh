#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -o errexit

echo "====== Step 1: Building Frontend (React.js) ======"
cd frontend
npm install
npm run build

echo "====== Step 2: Copying Static Assets to Backend ======"
# Ensure static directory exists
mkdir -p ../backend/src/main/resources/static
# Clear previous assets
rm -rf ../backend/src/main/resources/static/*
# Copy fresh build assets
cp -rf dist/* ../backend/src/main/resources/static/

echo "====== Step 3: Packaging Backend (Spring Boot JAR) ======"
cd ../backend
mvn clean package -DskipTests

echo "====== Build Complete! ======"
echo "The executable single JAR file is generated at: backend/target/backend-0.0.1-SNAPSHOT.jar"
