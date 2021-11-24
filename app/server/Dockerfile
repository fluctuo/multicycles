FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install

ADD . .

CMD [ "yarn", "run", "start" ]
