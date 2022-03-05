FROM node:16-alpine as builder

COPY package.json package-lock.json ./

# we have python dependencies
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

RUN npm ci && mkdir /app && mv ./node_modules ./app

WORKDIR /app

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN nginx -t -c /etc/nginx/nginx.conf

COPY --from=builder /app/dist/ /dist/
