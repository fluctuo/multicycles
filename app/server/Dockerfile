FROM node:8.9

WORKDIR /app

COPY package*.json ./

RUN npm install

ADD . .

CMD [ "npm", "start" ]
