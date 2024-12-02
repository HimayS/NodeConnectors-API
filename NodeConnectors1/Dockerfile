# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app

ENV NODE_ENV=production
EXPOSE 5001

CMD ["node", "src/app.js"]