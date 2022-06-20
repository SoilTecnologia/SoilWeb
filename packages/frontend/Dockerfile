FROM node:16.15.0

RUN mkdir -p /usr/soil/frontend

WORKDIR /usr/soil/frontend

COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
