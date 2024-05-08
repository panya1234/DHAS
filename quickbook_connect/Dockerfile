FROM openjdk:8-jdk-alpine

# Prepare CSV File Directory
RUN mkdir /app
RUN mkdir /app/quickbook_connect
RUN mkdir /app/quickbook_connect/target
RUN mkdir /app/quickbook_connect/target/CSV

COPY CSV /app/quickbook_connect/target/CSV
COPY ./target/quickbook_connect-1.0-SNAPSHOT.jar /app/quickbook_connect/target/app.jar

WORKDIR /app/quickbook_connect/target
EXPOSE 8080
CMD ["java","-jar","app.jar"]