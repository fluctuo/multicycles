FROM node:8.9

WORKDIR /app

ADD . /app/

RUN npm install && \
  NODE_ENV=production npm run build

VOLUME /app
