FROM node:20.15-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# PELO DOCKERIZE

# ENV DOCKERIZE_VERSION v0.7.0

# RUN apk update --no-cache \
#     && apk add --no-cache wget openssl \
#     && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
#     && apk del wget