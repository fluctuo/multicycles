FROM node:8.9

WORKDIR /app

ADD package.json /app/

RUN npm install --production

ADD . /app/

EXPOSE 3000

ENV NODE_ENV production

CMD [ "npm", "start" ]
