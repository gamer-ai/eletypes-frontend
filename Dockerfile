# Use the smallest base image for Node.js
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /eletypes-frontend

# Copy only the package.json and package-lock.json files first to leverage Docker's caching
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5173

# Command to run the application
CMD ["npm", "start"]
