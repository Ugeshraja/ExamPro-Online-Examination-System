# Stage 1: Build Frontend (React)
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend (Spring Boot)
FROM maven:3.8.8-eclipse-temurin-17 AS backend-builder
WORKDIR /app
COPY backend/pom.xml ./
RUN mvn dependency:go-offline

COPY backend/src ./src
# Copy compiled static resources from Stage 1 into the resources/static directory
COPY --from=frontend-builder /frontend/dist ./src/main/resources/static

RUN mvn clean package -DskipTests

# Stage 3: Run Application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-builder /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
