FROM node:20.11.1
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
