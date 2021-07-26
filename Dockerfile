# syntax=docker/dockerfile:1

FROM node:14.17

USER node
WORKDIR /app

RUN npm install -g npm

COPY package.json .
COPY package-lock.json .
RUN npm ci --production

COPY . .
CMD node src/server.js
