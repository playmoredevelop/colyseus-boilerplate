FROM node:18-alpine AS service

ARG _SERVICE_HOST='0.0.0.0:8080'
ARG _REDIS_HOST='0.0.0.0:6379'

RUN apk update

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
RUN npm i -fSD --no-shrinkwrap --no-package-lock --no-audit --no-fund

ENV SERVICE_HOST $_SERVICE_HOST
ENV REDIS_HOST $_REDIS_HOST

COPY . .
RUN npx tsc -p ./tsconfig.json

EXPOSE 8080
CMD ["npm", "start"]
