# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
# first period is current file , second period is working directory

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "./src/index.js"]