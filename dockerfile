# syntax=docker/dockerfile:1

FROM node:latest

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
# COPY ["server/package.json", "server/package-lock.json*", "./server"]

# RUN (cd ./server && npm install)
RUN npm install

COPY . .
RUN npm run build
EXPOSE 8080

CMD [ "npm", "start" ]