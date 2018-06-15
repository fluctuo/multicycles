FROM node:8.9

WORKDIR /app

ADD package.json /app/

RUN npm install

ADD . /app/

ENV HOST 0.0.0.0
ENV NODE_ENV production

CMD [ "npm", "start" ]
