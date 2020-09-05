FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
RUN npm run build-dist

ENV NODE_ENV production
RUN npm prune --production

RUN rm -rf src \
    npm rm tsconfig.json && \
    chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD npm run migration-run && npm run production
