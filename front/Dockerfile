FROM node:8.9

WORKDIR /app

COPY package*.json ./

RUN npm install

ADD . .

RUN NODE_ENV=production npm run build

CMD [ "npx", "serve@9", "-s", "-n" ]
