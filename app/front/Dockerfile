FROM node:8.9 as build-stage
WORKDIR /app
ARG BUILD_AS_BETA
ENV BUILD_AS_BETA=${BUILD_AS_BETA}
COPY package*.json ./
RUN npm install
ADD . .
RUN NODE_ENV=production npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/multicycles.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]
