FROM node:16

WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli
COPY package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig.json ./tsconfig.json

CMD [ "nest", "start" ]