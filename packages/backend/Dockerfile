FROM node:16.15.0

RUN mkdir -p /usr/soil/backend

WORKDIR /usr/soil/backend

COPY package.json .

COPY tsconfig.json .

RUN yarn 

COPY . .

EXPOSE 3308

CMD ["yarn", "dev"]