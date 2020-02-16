FROM node:10-alpine as builder

COPY package.json package-lock.json ./

# we have python dependencies
RUN apk add --update python make g++ && rm -rf /var/cache/apk/*

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ] ; then npm run build-dev ; else npm run build ; fi

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t -c /etc/nginx/nginx.conf

COPY --from=builder /app/dist/ /dist/
