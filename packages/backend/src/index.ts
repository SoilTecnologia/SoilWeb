/* eslint-disable camelcase */
// import './utils/config/module-alias';
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
import knex from './database';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const PORT = process.env.NODE_ENV === 'dev_docker' ? 3333 : 3308;

const httpServer = createServer(app);

httpServer.listen(PORT, async () => {
  console.info(`Server Listening on PORT ${PORT}, \n Welcome to the soil`);
  await knex.migrate.latest();
});

export const io = new Server(httpServer);
export const ioSocket = new IoConnect(io).start();
// raspberry.start();
// export const iotDevice = new IoTDevice('Raspberry', 0, 'agrishow_0');
export const iotDevice = new IoTDevice('Cloud', 0);
iotDevice.start();
InitScheduleData.start();
