# backend-site

## Firts steps

Install WSL Ubunto

Install NPM and NVM

Use node:18.18.2

npm install -g typescript
or
npm install --save-dev typescript

npm install express @types/express

Install docker and docker compose

## Prettier Config

npm install --save-dev prettier

npm install --save-dev --save-exact prettier-plugin-twig

Install on VSCode "Prettier - Code formatter" extension

## Run Project Backend

tsc
npm start

## Run Docker Project

docker compose up -d
or
docker compose up --build --force-recreate --no-deps -d

## Stop Docker Project

docker compose down
or
docker compose down -v
