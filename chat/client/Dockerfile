FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
#RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

ARG REACT_APP_SERVER_PORT
ARG REACT_APP_SERVER_HOST

RUN sh create-env-file.sh REACT_APP_SERVER_PORT=$REACT_APP_SERVER_PORT REACT_APP_SERVER_HOST=$REACT_APP_SERVER_HOST
RUN cat .env


# start app
CMD ["npm", "run", "start"]
