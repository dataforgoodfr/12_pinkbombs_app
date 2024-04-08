FROM --platform=linux/amd64 node:alpine

ENV PORT 3000
ENV YARN_CACHE_FOLDER=/dev/shm/yarn_cache

WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

# Production use node instead of root
# USER node

RUN yarn install --production --frozen-lockfile 

COPY . /usr/src/app

RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
