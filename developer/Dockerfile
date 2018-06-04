FROM node:8.9

WORKDIR /app

ADD package.json /app/

ENV NODE_ENV production

RUN npm install --production

ADD . /app/

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
