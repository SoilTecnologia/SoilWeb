/* eslint-disable camelcase */
/* 
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import 'reflect-metadata';
import { Server, Socket } from 'socket.io';
import IoTDevice from './aws-iot/index';
import { FarmsRepository } from './database/repositories/Farms/FarmsRepository';
import * as raspberry from './raspberry/tests';
import router from './routes';
import './shared/container';
import emitter from './utils/eventBus';

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

io.on('connection', (socket: Socket) => {
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

    // console.log(`socket de variavel: `, status);
  });

  emitter.on('action-ack-received', async (action) => {
    const { id } = action;
    const [farm_id, pivot_num] = id.split('_');

    /* Tentar melhorar isso daqui, nao depender de fazer uma query pra saber o usuario" */
    const farmRepository = new FarmsRepository();
    const farm = await farmRepository.findById(farm_id);
    const { user_id, farm_name } = farm!!;

    socket.emit(`${user_id}-ackreceived`, {
      type: 'ack',
      pivot_num,
      farm_name
    });
  });

  emitter.on('action-ack-not-received', async (action) => {
    const { id } = action;
    const [farm_id, pivot_num] = id.split('_');

    /* Tentar melhorar isso daqui, nao depender de fazer uma query pra saber o usuario" */
    const farmRepository = new FarmsRepository();
    const farm = await farmRepository.findById(farm_id);
    const { user_id, farm_name } = farm!!;

    socket.emit(`${user_id}-acknotreceived`, {
      type: 'ack',
      pivot_num,
      farm_name
    });
  });
});

raspberry.start();

const iotDevice = new IoTDevice('Cloud', 0);
// const iotDevice = new IoTDevice(
//   'Raspberry',
//   0,
//   'e5ce95e1-277d-40a7-b843-6d2cb51d1e8f/0'
// );
iotDevice.start();
// e5ce95e1-277d-40a7-b843-6d2cb51d1e8f
// cae38681-5734-4629-b564-31764fef9b97/1
