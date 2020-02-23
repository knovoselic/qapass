FROM node:10-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build-dist
RUN npm prune --production
RUN rm -rf src

EXPOSE 80 

ENTRYPOINT npm run production