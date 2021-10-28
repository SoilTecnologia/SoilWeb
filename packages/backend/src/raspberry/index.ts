import { Intent } from '@prisma/client';
import Axios from 'axios';
import internal from 'stream';
import { readAllIntentController } from '../controllers/intent';

type IntentData = {
  intent: Intent;
  timestamp: Date;
};

let activePool: Array<IntentData> = []; // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
let idlePool: Array<IntentData> = []; // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

export const start = async () => {
  const allIntents = await readAllIntentController();

  for (let intent of allIntents) {
    if (intent.power == 'NULL') {
      idlePool.push({ intent, timestamp: new Date() });
    } else {
      activePool.push({ intent, timestamp: new Date() });
    }
  }

  setInterval(() => checkPool(), 200);
};

const checkPool = async () => {
  if (ready) {
    ready = false;
    for (let activeIntent of activePool) {
      const response = await sendData(activeIntent);
    }
  }
};

const sendData = async (intent: IntentData) => {
  const response = await Axios.post(
    `http://192.168.100.105:3031/cmd?ID=${intent.intent.radio_name}&intencao=${intent.intent}`
  );

  return response;
};
