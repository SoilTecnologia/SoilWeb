import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import router from './routes/router';
import * as raspberry from './raspberry';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';
import { mainModule } from 'process';

const PORT = 3308;
const app = express();
const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

eventEmitter.on('intent', () => {
  console.log('INTENT event received!');
});

const iotDevice = new IoTDevice('Cloud', 1);
iotDevice.start();

// setInterval(() => {
//   iotDevice.publish({msg: "teste"}, "teste-0");
// }, 1000)
