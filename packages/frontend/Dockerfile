FROM node:16.15.0

WORKDIR /usr/soil/frontend


COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]