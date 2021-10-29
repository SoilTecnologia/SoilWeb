import { Intent } from '@prisma/client';
import Axios from 'axios';
import internal from 'stream';
import { readAllIntentController } from '../controllers/intent';
import emitter from '../utils/eventBus';

type IntentData = {
  intent: Intent;
  timestamp: Date;
};

let activePool: Array<IntentData> = []; // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
let idlePool: Array<IntentData> = []; // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

export const start = async () => {
  loadIntents();

  emitter.on('intent', (intent) => {
    ready = false;
    let counter = idlePool.length - 1;
    let found = false;
    while (counter >= 0) {
      if (idlePool[counter].intent.intent_id == intent.intent_id) {
        found = true;
        idlePool = idlePool.filter((value) => value != idlePool[counter]);
        activePool.push({ intent, timestamp: new Date() });

        break;
      }
      counter--;
    }

    if (!found) {
      counter = activePool.length - 1;
      while (counter >= 0) {
        if (activePool[counter].intent.intent_id == intent.intent_id) {
          activePool = activePool.filter((value) => value != activePool[counter]);
          activePool.push({ intent, timestamp: new Date() });
          break;
        }
      }
      counter--;
    }

    ready = true;
  });

  setInterval(() => {
    if (ready) checkPool();
  }, 2000);
};

const loadIntents = async () => {
  const allIntents = await readAllIntentController();

  for (let intent of allIntents) {
    if (intent.power == 'NULL') {
      idlePool.push({ intent, timestamp: new Date() });
    } else {
      activePool.push({ intent, timestamp: new Date() });
    }
  }
};

const checkPool = async () => {
  console.log('Check Pool: ', "IDLE: ", idlePool.length, " ACTIVE: ", activePool.length);
  ready = false;
  for (let activeIntent of activePool) {
    console.log("[ACTIVE] Sending data to pivot", activeIntent.intent.radio_name);
    const response = await sendData(activeIntent);
    if (response.status == 200) {
      activePool = activePool.filter((value) => value != activeIntent);

      activeIntent.timestamp = new Date();
      idlePool.push(activeIntent);
    }
  }

  for (let idleIntent of idlePool) {
    if (
      new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
      20000
    ) {
      console.log("[IDLE] Sending data to pivot", idleIntent.intent.radio_name);
      const response = await sendData(idleIntent);
      idleIntent.timestamp = new Date();
    }
  }

  ready = true;
};

const sendData = async (intent: IntentData) => {
  const response = await Axios.get(
    `http://localhost:3308/pivot/readAll/e5abc5ae-7467-497c-a00d-417186dfe860`
  );

  return response;
};
