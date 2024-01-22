FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

ADD . .

CMD [ "yarn", "run", "start" ]
