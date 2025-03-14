#
# Build stage
#
FROM maven:3.9.8-eclipse-temurin-21 AS build
WORKDIR /home/app
COPY pom.xml .
COPY src ./src
RUN mvn clean install -DskipTests

#
# Run stage
#
FROM eclipse-temurin:21-jre
WORKDIR /home/app
COPY --from=build /home/app/target/budgetGenerator-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]