import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import router from './routes';
// import * as raspberry from './raspberry/tests';
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
  console.log('INTENT event received!');
});


type teste = {
  name: string,
  attempts: 0
}

let testQueue: Queue<teste> = new Queue<teste>();
testQueue.enqueue({ name: 'teste1', attempts: 0 });
testQueue.enqueue({ name: 'teste2', attempts: 0 });

setInterval(() => {
  const current = testQueue.peek();
  console.log(`name: ${current?.name}`);
  console.log(`attempts: ${current?.attempts}`);

  current!.attempts++;
}, 2000)


// raspberry.start();

// const iotDevice = new IoTDevice('Cloud', 1);
// iotDevice.start();

// setInterval(() => {
//   iotDevice.publish({msg: "pirulitin"}, "cloud");
// }, 1000)
