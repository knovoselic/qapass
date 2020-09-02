FROM node:10-alpine

ENV NODE_ENV production
WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm run build-dist
RUN npm prune --production

RUN rm -rf src \
    npm rm tsconfig.json && \
    chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD npm run migration-run && npm run production