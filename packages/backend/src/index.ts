const knexConfig = require("../knexfile");

import express from 'express';
import Knex from 'knex';
import { Model } from 'objection';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './routes/router';
import * as raspberry from './raspberry/tests';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';
import User from './models/user';
import Farm from './models/farm';

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


(async () => {
  await Farm.query().insertGraph({
    farm_name: "Santa Rita",
    city: "Santa rita",
    gateway: "192.168.0.1",
    lat: "12.12",
    lng: "12.12",
    users: [
      {
        login: "admin",
        password: "admin",
        user_type: "SUDO"
      }
    ] 
  });
})();
console.log("Calling")

// raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 1);
// iotDevice.start();

// setInterval(() => {
//   iotDevice.publish({msg: "pirulitin"}, "cloud");
// }, 1000)
