/* eslint-disable camelcase */
/* 
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/

import express from 'express';
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from 'cors';
import router from './routes';
import * as raspberry from './raspberry/tests';
import emitter from './utils/eventBus';
import IoTDevice from './aws-iot/index';

require('dotenv').config();


const PORT = 3308;
const app = express();
const httpServer = createServer(app); 
const io = new Server(httpServer);

app.use(cors());
app.use(express.json());
app.use(router);
httpServer.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

io.on("connection", (socket: Socket) => {
  emitter.on('state-change', (status: any) => {
    const {user_id, pivot_name, farm_name, pivot_id, connection, power, water, direction, percentimeter} = status;
    socket.emit(`${user_id}-status`, {
      type: "status",
      pivot_id,
      pivot_name,
      farm_name, 
      power,
      water,
      direction,
      connection,
      percentimeter
    });

    console.log(`socket de state: `, status)
  })

  emitter.on('variable-change', (status: any) => {
    const {user_id, pivot_id, angle, percentimeter} = status;
    socket.emit(`${user_id}-status`, {
      type: "variable",
      pivot_id,
      angle,
      percentimeter
    });

    console.log(`socket de variavel: `, status)
  })
})

raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 0);
const iotDevice = new IoTDevice('Raspberry', 0, 'cae38681-5734-4629-b564-31764fef9b97/1');
iotDevice.start();
