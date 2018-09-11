FROM node:8.9

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV HOST 0.0.0.0
ENV NODE_ENV production

CMD [ "npm", "start" ]
