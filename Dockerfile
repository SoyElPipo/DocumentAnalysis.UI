# Etapa 1: build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY . ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]