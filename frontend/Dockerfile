FROM node:18.14.0-alpine as build
WORKDIR /home/app

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine3.17-slim

COPY --from=build /home/app/build /usr/share/nginx/html
COPY --from=build /home/app/nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]