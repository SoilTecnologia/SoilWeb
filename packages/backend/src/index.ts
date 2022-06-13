/* eslint-disable camelcase */
/* 
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/
import dotenv from "dotenv"
import cors from 'cors';
import dayjs from 'dayjs';
import express from 'express';
import { createServer } from 'http';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import IoTDevice from './aws-iot';
import * as raspberry from './raspberry/tests';
import router from './routes';
import { InitScheduleData } from './schedule';
import './shared/container';
import emitter from './utils/eventBus';
import { handleResultAction } from './utils/handleFarmIdWithUndescores';
dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
})

const PORT = 3308;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
export const ioConnect = io;

app.use(cors());
app.use(express.json());
app.use(router);

httpServer.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}, \n Welcome to the soil`);
});

class SocketIoConnect {
  socketIo: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

  constructor() {
    this.socketIo = io;
  }
}

export const socketsIoConnect = new SocketIoConnect();

try {
  io.on('connection', (socket: Socket) => {
    emitter.on('action-update', (action) => {
      socket.emit(`action-response-${action.id}`, {
        type: 'sucess'
      });
    });

    emitter.on('action-not-update', (action) => {
      socket.emit(`action-response-${action.id}`, {
        type: 'fail'
      });
    });

    emitter.on('state-change', (status: any) => {
      const {
        user_id,
        pivot_num,
        farm_name,
        pivot_id,
        connection,
        power,
        water,
        direction,
        percentimeter
      } = status;
      socket.emit(`${user_id}-status`, {
        type: 'status',
        pivot_id,
        pivot_num,
        farm_name,
        power,
        water,
        direction,
        connection,
        percentimeter
      });
      emitter.off('connection', () => {});

      // console.log(`socket de state: `, status);
    });

    emitter.on('variable-change', (status: any) => {
      const { user_id, pivot_id, angle, percentimeter } = status;
      socket.emit(`${user_id}-status`, {
        type: 'variable',
        pivot_id,
        angle,
        percentimeter
      });
      emitter.off('variable-change', () => {});

      // console.log(`socket de variavel: `, status);
    });

    emitter.on('action-received-ack', async (action) => {
      const { user_id, farm_name, pivot_num } = await handleResultAction(
        action.id
      );

      socket.emit(`ack-response-${action.id}`, {
        type: 'sucess',
        user_id: user_id,
        pivot_id: action.id,
        pivot_num,
        farm_name
      });

      emitter.off('action-received-ack', () => {});
    });

    emitter.on('action-ack-not-received', async (action) => {
      const { user_id, farm_name, pivot_num } = await handleResultAction(
        action.id
      );

      socket.emit(`ack-response-${action.id}`, {
        user_id,
        type: 'fail',
        pivot_id: action.id,
        pivot_num,
        farm_name
      });
      
      emitter.off('action-ack-not-received', () => {});
    });
  });
} catch (err) {
  console.log('Error to connect Io');
  console.log(err.message);
}

// raspberry.start();
// export const iotDevice = new IoTDevice('Raspberry', 0, 'agrishow_0');
export const iotDevice = new IoTDevice('Cloud', 0);
iotDevice.start();
InitScheduleData.start();
