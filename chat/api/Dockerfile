FROM node:16

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
RUN npm install -g @nestjs/cli
RUN npm install
COPY src ./src
COPY tsconfig.json ./tsconfig.json

CMD [ "nest", "start" ]