
FROM node:8.9

WORKDIR /app

ADD . /app/

ENV NODE_ENV production

RUN npm install && \
  npm run build

EXPOSE 3000
