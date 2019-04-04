FROM node:10 as build-stage
WORKDIR /app
ARG MODE=production
ENV MODE=${MODE}
COPY package*.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build --mode ${MODE}

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/multicycles.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
