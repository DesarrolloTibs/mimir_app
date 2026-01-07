# Stage 1: Build the application
FROM node:20-bullseye AS build

# Set the working directory
WORKDIR /app

# Copy package configuration files
# Copying these first allows Docker to cache the expensive npm install step
COPY package.json package-lock.json* ./

# Install dependencies. Using --legacy-peer-deps to avoid potential peer dependency conflicts.
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the application using the script from package.json
RUN npm run build -- --mode docker

# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration from the project
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application from the 'build' stage to the Nginx web root directory
# The output of 'nx build' is placed in the 'dist/' folder
COPY --from=build /app/dist/ /usr/share/nginx/html/www/mimirapp/

# Expose port 80 to allow traffic to the Nginx server
EXPOSE 4200

# Start Nginx in the foreground when the container launches
CMD ["nginx", "-g", "daemon off;"]