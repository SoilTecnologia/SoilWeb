import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './routes';
import * as raspberry from './raspberry/tests';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';
import Queue from './utils/queue';

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
  // console.log('INTENT event received!');
});


raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 0);
const iotDevice = new IoTDevice('Raspberry', 0, '3cadb957-5787-11ec-bcf7-6432a83ce5f6/0');
iotDevice.start();

// setInterval(() => {
//   iotDevice.publish({msg: "pirulitin"}, "cloud");
// }, 1000)
