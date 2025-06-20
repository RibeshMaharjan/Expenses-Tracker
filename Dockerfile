FROM node:20
LABEL authors="asura"

ENV PORT=8000 \
    PG_DATABASE='expenses_tracker' \
    PG_HOST='db' \
    PG_PORT=5432 \
    PG_USER='postgres' \
    PG_PASSWORD='mypassword' \
    TOKEN='a703d507b7a4821ce088f910ab6b877c5cb1da85edcc04db7f4fe143547bb44ca83171669ee0efc3671306cce1ab328a082a2ccace4116459d09c6ff8c489888' \
    REFRESH_TOKEN='f0b27c2a4ce703a388641d8a077acca58fe6d1a36a8d3cf1fe5c055a2436669410a40a0fbaf5f4e586dbb86f80513ad5a9d361c581bfda202a6b7fba1b39f86a'

RUN mkdir -p myapp

WORKDIR /myapp

COPY /client ./client

RUN cd client && npm install && npm run build

COPY /server/package-lock.json ./server/package-lock.json
COPY /server/package.json ./server/package.json

RUN cd server && npm install

COPY /server ./server

EXPOSE 8000
