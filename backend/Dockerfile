# STAGE 1
FROM node:18-alpine AS builder
WORKDIR /backend-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STAGE 2
FROM node:18-alpine
WORKDIR /backend-app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /backend-app/dist ./dist
COPY . .

EXPOSE 4000
CMD [ "node", "dist/index.js" ]
