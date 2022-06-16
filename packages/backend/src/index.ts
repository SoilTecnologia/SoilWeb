/* eslint-disable camelcase */
/*
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/
import './utils/config/module-alias';
import 'reflect-metadata';
import './shared/container';
import dotenv from 'dotenv';
import IoTDevice from './aws-iot';
import * as raspberry from './raspberry/tests';
import { InitScheduleData } from './schedule';
import { Server } from 'socket.io';
import { IoConnect } from './io-connect';
import { createServer } from 'http';
import { app } from './app';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});
const httpServer = createServer(app);
httpServer.listen(3308, () => {
  console.info(`Server Listening on PORT ${3308}, \n Welcome to the soil`);
});

export const io = new Server(httpServer);
new IoConnect(io).start();
// raspberry.start();
// export const iotDevice = new IoTDevice('Raspberry', 0, 'agrishow_0');
export const iotDevice = new IoTDevice('Cloud', 0);
iotDevice.start();
InitScheduleData.start();
