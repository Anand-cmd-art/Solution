# Build stage
FROM node:23-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
# Using the Ngnix to serve as the ingess service
FROM nginx:1.28-alpine-slim
COPY --from=builder /app/build /usr/share/nginx/html 
EXPOSE 80
