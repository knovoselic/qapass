FROM node:10-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && \
    npm run build-dist && \
    npm rm tsconfig.json \
    npm prune --production && \
    rm -rf src \
    touch .env && \
    echo "APP_ENV=production" >> .env && \
    echo "APP_SECRET=codeconssecret" >> .env && \
    echo "APP_RUN=dist" >> .env && \
    echo "TZ=\"Europe/Zagreb\"" >> .env && \
    echo "DB_HOST=mysql" >> .env && \
    echo "DB_PORT=3306" >> .env && \
    echo "DB_USERNAME=codecons" >> .env && \
    echo "DB_PASSWORD=codecons" >> .env && \
    echo "DB_DATABASE=codecons" >> .env && \
    chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD npm run migration-run && npm run production