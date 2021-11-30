import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import http from 'http';
import router from './routes/router';
import * as raspberry from './raspberry/tests';
import EventEmitter from 'events';
import IoTDevice from './aws-iot/index';

const PORT = 3308;
const app = express();
const httpServer = createServer(app); // Needed for socket.io
const io = new Server(httpServer);
const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.json());
app.use(router);


io.on("connection", socket => {
  eventEmitter.on('status', status => {
    socket.emit('status', status);
  })
})

httpServer.listen(PORT, () => {
  console.info(`Server Listening on PORT ${PORT}`);
});

//raspberry.start();

<<<<<<< HEAD
const iotDevice = new IoTDevice('Cloud', 0);
=======
const iotDevice = new IoTDevice('Raspberry', 0, "inatel/1");
>>>>>>> 4db571cc6600c4b2723c36cb6e54727460c1f552
iotDevice.start();

app.get('/', (req, res) => {
  res.send('Hello World!');
})
