FROM node:8.9

WORKDIR /app

ADD package.json /app/

RUN npm install

ADD . /app/

RUN npm run build

EXPOSE 3000

ENV NODE_ENV production

CMD [ "npm", "start" ]
