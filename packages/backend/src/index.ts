import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';
import router from './routes/router';
import * as raspberry from './raspberry';
import EventEmitter from 'events';

const PORT = 3308;
const app = express();
const eventEmitter = new EventEmitter();

  console.log("Waiting for socket connections..")

  eventEmitter.on("intent", () => {
    console.log("INTENT")
  })

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

// raspberry.start();
