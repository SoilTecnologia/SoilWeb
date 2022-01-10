/* 
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/

require('dotenv').config();

import express from 'express';
import cors from 'cors';
import router from './routes';
import * as raspberry from './raspberry';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';

const PORT = 3308;
const app = express();
const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.json());
app.use(router);
app.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 0);
const iotDevice = new IoTDevice('Raspberry', 0, '98b78b11-76e1-42c5-b6fc-f6c379d7ed09/0');
iotDevice.start();