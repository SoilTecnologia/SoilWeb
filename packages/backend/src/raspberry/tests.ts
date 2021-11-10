import {
  DirectionState,
  Intent,
  WaterState,
  PowerState,
  ConnectionState,
  Pivot
} from '@prisma/client';
import { Readable } from 'stream';
import {FormDataEncoder} from 'form-data-encoder';
import {FormData} from 'formdata-node';
import Axios, { AxiosResponse } from 'axios';
import { readAllIntentController } from '../controllers/intent';
import { updatePivotController } from '../controllers/pivot';
import { updateRadioController } from '../controllers/radio';
import emitter from '../utils/eventBus';

const TIMEOUT = 5000;

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
          activePool = activePool.filter(
            (value) => value != activePool[counter]
          );
          activePool.push({ intent, timestamp: new Date() });
          break;
        }
      }
      counter--;
    }

    ready = true;
  });

  // Seta um intervalo para ficar checando a pool
  // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo
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

type RaspberryResponse = {
  connection: ConnectionState;
  direction: DirectionState;
  water: WaterState;
  power: PowerState;
  percentimeter: number;
  angle: number;
  timestamp: number;
};

const stringToStatus = (responseString: string) => {
  let [_, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})-(\d{1})-(\d{1})-(\d{2})-(\d{3})-(\d+)/.exec(responseString) || [
      '',
      '',
      '',
      '',
      0,
      0,
      0
    ];


  let response: RaspberryResponse = {
    connection: 'ONLINE',
    direction: 'NULL',
    water: 'NULL',
    power: 'NULL',
    percentimeter: 0,
    angle: 0,
    timestamp: 0
  };

  if (direction == '3') {
    response.direction = 'CLOCKWISE';
  } else if (direction == '4') {
    response.direction = 'ANTI_CLOCKWISE';
  }

  if (water == '5') {
    response.water = 'DRY';
  } else if (water == '6') {
    response.water = 'WET';
  }

  if (power == '1') {
    response.power = 'ON';
  } else if (direction == '2') {
    response.power = 'OFF';
  }

  response.percentimeter = Number(percentimeter);
  response.angle = Number(angle);
  response.timestamp = Number(timestamp);

  return response;
};

const intentToString = ({ intent }: { intent: Intent }): string => {
  let intentString = '';

  if (intent.direction == 'CLOCKWISE') {
    intentString = intentString.concat('3');
  } else if (intent.direction == 'ANTI_CLOCKWISE') {
    intentString = intentString.concat('4');
  } else {
    return '00000';
  }

  if (intent.water == 'DRY') {
    intentString = intentString.concat('5');
  } else if (intent.water == 'WET') {
    intentString = intentString.concat('6');
  } else {
    return '00000';
  }

  if (intent.power == 'ON') {
    intentString = intentString.concat('1');
  } else if (intent.power == 'OFF') {
    intentString = intentString.concat('2');
  } else {
    return '00000';
  }

  // Adds the percentimeter to the end
  // padStart adds 0's if the percentimeter string < 3, ie: 10 turns into 010
  if (intent.percentimeter == 100) {
    intentString = intentString.concat('99');
  } else {
    intentString = intentString.concat(
      intent.percentimeter.toString().padStart(2, '0')
    );
  }

  return intentString;
};

const processResponse = async (
  pivot_name: Pivot['pivot_name'],
  intent: Intent,
  response: any
) => {
   console.log(response)
  updateRadioController(pivot_name, response.payload[3])
};

const sendData = async (intent: IntentData) => {
  let intentString: string = intentToString(intent);
  console.log(intent.intent.radio_name);

  let bodyFormData = new FormData();

  bodyFormData.set("ID", intent.intent.radio_name);
  bodyFormData.set("CMD", "213");
  bodyFormData.set("intencao", "000");
  const encoder = new FormDataEncoder(bodyFormData);

  const response = await Axios({
    method: "POST",
    url: `http://192.168.100.100:3031/comands`,
    headers: encoder.headers,
    data: Readable.from(encoder),
    timeout: TIMEOUT
  });

  return response;
};

const checkPool = async () => {
  console.log(
    'Check Pool: ',
    'IDLE: ',
    idlePool.length,
    ' ACTIVE: ',
    activePool.length
  );
  ready = false;
  for (let activeIntent of activePool) {
    console.log(
      '[ACTIVE] Sending data to pivot',
      activeIntent.intent.radio_name
    );

    try {
      const response = await sendData(activeIntent);
      if (response.status == 200) {
        activePool = activePool.filter((value) => value != activeIntent);

        activeIntent.timestamp = new Date();
        idlePool.push(activeIntent);
        processResponse(
          activeIntent.intent.radio_name,
          activeIntent.intent,
          response.data
        );
      }
    } catch (err) {
        console.log('TIMEOUT on', activeIntent.intent.radio_name);
        activePool = activePool.filter((value) => value != activeIntent);

        activeIntent.timestamp = new Date();
        idlePool.push(activeIntent);
    }
  }

  for (let idleIntent of idlePool) {
    if (
      new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
      8000
    ) {
      console.log('[IDLE] Sending data to pivot', idleIntent.intent.radio_name);

      try {
        const response = await sendData(idleIntent);
        idleIntent.timestamp = new Date();
        processResponse(
          idleIntent.intent.radio_name,
          idleIntent.intent,
          response.data
        );
      } catch (err) {
        console.log('TIMEOUT on', idleIntent.intent.radio_name);
      }
    }
  }

  ready = true;
};
