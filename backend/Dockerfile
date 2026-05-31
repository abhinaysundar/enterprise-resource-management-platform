# ==============================================================================
# STAGE 1: Maven Builder
# ==============================================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Copy parent and submodule pom files to cache dependency downloads
COPY pom.xml .
COPY erm-common/pom.xml erm-common/
COPY erm-data/pom.xml erm-data/
COPY erm-core/pom.xml erm-core/
COPY erm-api/pom.xml erm-api/

# Download dependencies offline to optimize compilation cache times
RUN mvn dependency:go-offline -B

# Copy actual source files
COPY erm-common/src ./erm-common/src
COPY erm-data/src ./erm-data/src
COPY erm-core/src ./erm-core/src
COPY erm-api/src ./erm-api/src

# Package compiled code into runnable jars, skipping tests since verified separately
RUN mvn clean package -DskipTests -B

# ==============================================================================
# STAGE 2: Lightweight Runtime JRE Alpine
# ==============================================================================
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Install security patches and curl for healthcheck calls
RUN apk update && apk upgrade && apk add --no-cache curl && rm -rf /var/cache/apk/*

# Create a secure, non-privileged system group and user
RUN addgroup -S ermgroup && adduser -S ermuser -G ermgroup
USER ermuser

# Copy the runnable api fat-jar from the builder stage
COPY --from=builder /build/erm-api/target/erm-api-1.0.0-SNAPSHOT.jar ./erm-service.jar

# Expose standard Spring Boot port
EXPOSE 8080

# Configure production-optimized JVM settings
ENV JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar erm-service.jar"]
