const knexConfig = require('./knexfile'); 

import express from 'express';
import Knex from 'knex';
import {Model} from 'objection';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './routes/router';
import * as raspberry from './raspberry/tests';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';
import User from './models/user';

const knex = Knex(knexConfig.development);
Model.knex(knex);

const PORT = 3308;
const app = express();
const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.json());
// app.use(router);
app.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

eventEmitter.on('intent', () => {
  console.log('INTENT event received!');
});

User.query().insert({
  login: 'marcos',
  password: '1234',
  user_type: 'SUDO',
})


// raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 1);
// iotDevice.start();

// setInterval(() => {
//   iotDevice.publish({msg: "pirulitin"}, "cloud");
// }, 1000)
