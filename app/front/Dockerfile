FROM node:14-alpine as build-stage
WORKDIR /app
ARG MODE=production
ENV MODE=${MODE}
COPY package*.json .
RUN yarn install
COPY . .
RUN yarn run build --mode ${MODE}

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/multicycles.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
