# Create image based on the official Node image from dockerhub
FROM node:lts-buster
 
# Create app directory
WORKDIR /usr/src/app
 
# Copy dependency definitions
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
 
# Install dependencies
RUN npm ci
 
# Get all the code needed to run the app
COPY . .
 
# Expose the port the app runs in
EXPOSE 8000
 
# Serve the app
CMD ["npm", "start"]