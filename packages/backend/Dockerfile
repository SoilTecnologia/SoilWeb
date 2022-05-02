FROM node:16.15.0

WORKDIR /usr/soil/backend

COPY package.json .

COPY .env ./

COPY tsconfig.json ./

RUN yarn 

COPY . .

EXPOSE 3308

CMD ["yarn", "dev"]