import {
  DirectionState,
  Intent,
  WaterState,
  PowerState,
  ConnectionState,
  Pivot
} from '@prisma/client';
import { Readable } from 'stream';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import Axios, { AxiosResponse } from 'axios';
import {
  readAllIntentController,
  updateIntentController
} from '../controllers/intent';
import { updatePivotController } from '../controllers/pivot';
import { updateRadioController } from '../controllers/radio';
import emitter from '../utils/eventBus';

const TIMEOUT = 10000;
const fatherUpdate = 10;
let fatherCounter = 0;

type IntentData = {
  intent: Intent;
  timestamp: Date;
  attempts: number;
};

let activePool: Array<IntentData> = []; // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
let idlePool: Array<IntentData> = []; // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

export const switchPools = (
  value: IntentData,
  origin: Array<IntentData>,
  destination: Array<IntentData>
) => {
  // console.log('SWITCHING');
  let state = 0;
  try {
    destination.push(value);
    state = 1;

    origin = origin.filter((v) => v == value);
    state = 2;
    return origin;
  } catch (err) {
    if (state > 0) {
      destination = destination.filter((v) => v == value);
    }

    if (state > 1) {
      origin.push(value);
    }

    console.log('Tentado recuperar mudança nas pools..');
  }
};

export const start = async () => {
  loadIntents();

  emitter.on('intent', (intent) => {
    // console.log('EVENT INTENT', intent);
    ready = false;
    let counter = idlePool.length - 1;
    let found = false;
    let state = 0;

    try {
      while (counter >= 0) {
        if (idlePool[counter].intent.intent_id == intent.intent_id) {
          found = true;
          const switchedPools = switchPools(
            { intent, timestamp: new Date(), attempts: 0 },
            idlePool,
            activePool
          );
          idlePool = switchedPools!;
          break;
        }
        counter--;
      }

      // if (!found) {
      //   counter = activePool.length - 1;
      //   while (counter >= 0) {
      //     if (activePool[counter].intent.intent_id == intent.intent_id) {
      //       activePool[counter].intent = intent;
      //       activePool[counter].timestamp = new Date();
      //       activePool[counter].attempts = 0;
      //       break;
      //     }
      //   }
      //   counter--;
      // }
    } catch (err) {
      console.log('Erro durante mudança de pools');
      console.log(err);
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
    idlePool.push({ intent, timestamp: new Date(), attempts: 0 });
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

const stringToStatus = (statusPayload: []) => {
  const responseString = String.fromCharCode(...statusPayload);
  // console.log('RECEBIDO:', responseString);
  let [full, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})-(\d{1})-(\d{1})-(\d+)-(\d+)-(\d+)/.exec(
      responseString.replace(/\s*/g, '')
    ) || ['', '', '', '', 0, 0, 0];

  if (!full) throw Error('deu ruim');

  let response: RaspberryResponse = {
    connection: 'ONLINE',
    direction: 'NULL',
    water: 'NULL',
    power: 'NULL',
    percentimeter: 0,
    angle: 0,
    timestamp: 0
  };

  // console.log(direction)

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
  } else if (power == '2') {
    response.power = 'OFF';
  }

  response.percentimeter = Number(percentimeter);
  response.angle = Number(angle);
  response.timestamp = Number(timestamp);

  return response;
};

const intentToString = ({ intent }: any): string => {
  let intentString = '';

  console.log("INTENT", intent)

  if (intent.direction == 'CLOCKWISE') {
    intentString = intentString.concat('3');
  } else if (intent.direction == 'ANTI_CLOCKWISE') {
    intentString = intentString.concat('4');
  }

  if (intent.water == 'DRY') {
    intentString = intentString.concat('5');
  } else if (intent.water == 'WET') {
    intentString = intentString.concat('6');
  }
  if (intent.power == 'ON') {
    intentString = intentString.concat('1');
  } else if (intent.power == 'OFF') {
    return '002000';
  } else {
  }

  // Adds the percentimeter to the end
  // padStart adds 0's if the percentimeter string < 3, ie: 10 turns into 010
  if (intent.percentimeter == 100) {
    intentString = intentString.concat('99');
  } else {
    intentString = intentString.concat(
      intent.percentimeter.toString().padStart(3, '0')
    );
  }

  return intentString;
};

const processResponse = async (
  intent: Intent,
  response: any,
  response_time: number
) => {
  try {
    const newStatus = stringToStatus(response.payload);
    console.log('[OK] on ', intent.pivot_name);
    // console.log(newStatus);
    // console.log(intent);
    // const {power, water, direction} = intent.intent;

    if (newStatus.power != 'OFF') {
      if (
        newStatus.power == intent.power &&
        newStatus.water == intent.water &&
        newStatus.direction == intent.direction
      ) {
        // console.log(intent.pivot_id);
        await updatePivotController(
          intent.pivot_id,
          'ONLINE',
          newStatus.power,
          newStatus.water,
          newStatus.direction,
          0,
          newStatus.percentimeter
        );

        await updateIntentController(
          intent.pivot_id,
          'NULL',
          'NULL',
          'NULL',
          0
        );
      }
    } else {
      if (newStatus.power == intent.power) {
        await updatePivotController(
          intent.pivot_id,
          'ONLINE',
          newStatus.power,
          'NULL',
          'NULL',
          0,
          0
        );

        await updateIntentController(
          intent.pivot_id,
          'NULL',
          'NULL',
          'NULL',
          0
        );
      }
    }
  } catch (err) {
    console.log('Erro no processResponse');
  }
};

const sendData = async (intent: IntentData) => {
  // console.log("ORIGINAL INTENT", intent)
  let intentString: string = intentToString(intent);

  let bodyFormData = new FormData();
  // console.log(intentString);

  bodyFormData.set('ID', intent.intent.pivot_name);
  // bodyFormData.set('CMD', '213');
  // console.log('INTENCAOOOO', intentString);
  bodyFormData.set('intencao', intentString);
  const encoder = new FormDataEncoder(bodyFormData);

  const start = Date.now();

  let response = await Axios({
    method: 'POST',
    url: `http://192.168.100.108:3031/comands`,
    headers: encoder.headers,
    data: Readable.from(encoder),
    timeout: TIMEOUT
  });

  const end = Date.now();

  return { response, response_time: end - start };
};

const checkPool = async () => {
  ready = false;
  console.log('[ACTIVES]: ', activePool.length);
  console.log('[IDLES]: ', idlePool.length);

  if (fatherCounter < fatherUpdate) {
    // console.log(
    //   'Check Pool: ',
    //   'IDLE: ',
    //   idlePool.length,
    //   ' ACTIVE: ',
    //   activePool.length
    // );
    for (let activeIntent of activePool) {
      console.log(
        '[ACTIVE]\tSending data to pivot',
        activeIntent.intent.pivot_name
      );

      try {
        const result = await sendData(activeIntent);
        const { response, response_time } = result;
        activeIntent.timestamp = new Date();
        if (
          response.status == 200 &&
          response.data.id == activeIntent.intent.pivot_name
        ) {
          activePool = activePool.filter((value) => value != activeIntent);

          activeIntent.attempts = 0;
          idlePool.push(activeIntent);
          processResponse(activeIntent.intent, response.data, response_time);
        } else {
          console.log(
            `[ERROR]\tResposta de outro id: -> ${activeIntent.intent.pivot_name} | -> ${response.data.id}`
          );
          activeIntent.attempts++;

          if (activeIntent.attempts >= 5) {
            await updatePivotController(
              activeIntent.intent.pivot_id,
              'OFFLINE'
            );
            activeIntent.attempts = 0;
          }
        }
      } catch (err) {
        console.log(err);
        console.log('[TIMEOUT]\ton', activeIntent.intent.pivot_name);
        activeIntent.attempts++;

        idlePool = switchPools(activeIntent, idlePool, activePool)!;

        if (activeIntent.attempts >= 5) {
          await updatePivotController(
            activeIntent.intent.pivot_id,
            'OFFLINE'
          );
          activeIntent.attempts = 0;
        }
      }
    }

    for (let idleIntent of idlePool) {
      if (
        new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
        8000
      ) {
        console.log(
          '[IDLE]\tSending data to pivot',
          idleIntent.intent.pivot_name
        );

        try {
          const result = await sendData(idleIntent);
          const { response, response_time } = result;

          idleIntent.timestamp = new Date();
          if (
            response.status == 200 &&
            response.data.id == idleIntent.intent.pivot_name
          ) {
            // console.log("VOLTOU RESPOSTA -> PROCESSRESPONSE")
            idleIntent.attempts = 0;
            processResponse(idleIntent.intent, response.data, response_time);
          } else {
            console.log(
              `[ERROR]\tResposta de outro id: -> ${idleIntent.intent.pivot_name} | -> ${response.data.id}`
            );
            idleIntent.attempts++;

            if (idleIntent.attempts >= 5) {
              await updatePivotController(
                idleIntent.intent.pivot_id,
                'OFFLINE'
              );
              idleIntent.attempts = 0;
            }
          }
        } catch (err) {
          idleIntent.attempts++;
          console.log('[TIMEOUT]\ton', idleIntent.intent.pivot_name);

          if (idleIntent.attempts >= 5) {
            await updatePivotController(
              idleIntent.intent.pivot_id,
              'OFFLINE'
            );
            idleIntent.attempts = 0;
          }
        }
      }
    }
  } else {
    fatherCounter = 0;
  }
  fatherCounter++;
  ready = true;
};
