FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN yarn install

ADD . .

CMD [ "yarn", "run", "start" ]
