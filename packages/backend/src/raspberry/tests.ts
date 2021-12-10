import { Readable } from 'stream';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import Axios, { AxiosResponse } from 'axios';
import emitter from '../utils/eventBus';
import Queue from '../utils/queue';
import {
  StatusObject,
  statusStringToObject,
  objectToActionString
} from '../utils/conversions';
import {
  updatePivotController,
  readAllPivotsController2
} from '../controllers/pivots';
import { readAllActionsController } from '../controllers/actions';
import Action from '../models/action';

const TIMEOUT = 2000;

type ActionData = {
  action: Action;
  timestamp: Date;
  attempts: number;
};

type IdleData = {
  pivot_id: string;
  radio_id: number;
  attempts: number;
};

let activeQueue: Queue<ActionData> = new Queue<ActionData>(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
let idleQueue: Queue<IdleData> = new Queue<IdleData>(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

export const start = async () => {
  loadActions();
  loadPivots();

  emitter.on('action', (action) => {
    activeQueue.enqueue({ action, timestamp: new Date(), attempts: 0 });
  });

  // Seta um intervalo para ficar checando a pool
  // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo
  setInterval(() => {
    if (ready) checkPool();
  }, 5000);
};

type RadioResponse = {
  cmd: number;
  id: number;
  payload: Array<number>;
  status: string;
};

const sendData = async (radio_id: number, data: string) => {
  let bodyFormData = new FormData();

  bodyFormData.set('ID', radio_id);
  bodyFormData.set('CMD', '40');
  bodyFormData.set('intencao', data);
  const encoder = new FormDataEncoder(bodyFormData);

  // let response = await Axios.post<RadioResponse>(
  //   'http://localhost:8080/comands',
  //   Readable.from(encoder),
  //   { headers: encoder.headers, timeout: TIMEOUT }
  // );
  let response = await Axios.post<RadioResponse>(
    'http://192.168.100.107:3031/comands',
    Readable.from(encoder),
    { headers: encoder.headers, timeout: TIMEOUT }
  );

  return response;
};

const checkResponse = (action: Action, payload: StatusObject) => {
  if (payload) {
    if (
      payload.power == action.power &&
      payload.water == action.water &&
      payload.direction == action.direction
    )
      return true;
  }

  return false;
};

const checkPool = async () => {
  ready = false;
  if (!activeQueue.isEmpty()) {
    console.log('CHECKING ACTIVE');
    const current = activeQueue.peek();

    try {
      const { power, water, direction, percentimeter } = current.action;
      const request = await sendData(
        current.action.radio_id,
        objectToActionString(power, water, direction, percentimeter)
      );
      const payload = request.data.payload;
      const payloadObject = statusStringToObject(
        String.fromCharCode(...payload)
      );

      if (payloadObject && checkResponse(current.action, payloadObject)) {
        await updatePivotController(
          current.action.pivot_id,
          true,
          payloadObject.power,
          payloadObject.water,
          payloadObject.direction,
          payloadObject.angle,
          payloadObject.percentimeter,
          payloadObject.timestamp,
          '',
          null
        );
        activeQueue.dequeue();
      }
    } catch (err) {
      console.log(`[ERROR]: ${err}`);

      if (current.attempts > 0) {
        await updatePivotController(
          current.action.pivot_id,
          false,
          null,
          null,
          null,
          null,
          null,
          new Date(),
          null,
          null
        );
        const removed = activeQueue.dequeue();
      } else {
        const current = activeQueue.dequeue()!;
        current.attempts++;
        activeQueue.enqueue(current!);
      }
    }
  } else if (!idleQueue.isEmpty()) {
    let current = idleQueue.peek();
    console.log('CHECKING IDLE');

    try {
      const request = await sendData(current.radio_id, '000000');
      const payload = request.data.payload;
      const payloadObject = statusStringToObject(
        String.fromCharCode(...payload)
      );

      if (payloadObject) {
        await updatePivotController(
          current.pivot_id,
          true,
          payloadObject.power,
          payloadObject.water,
          payloadObject.direction,
          payloadObject.angle,
          payloadObject.percentimeter,
          payloadObject.timestamp,
          null,
          null
        );
        current.attempts = 0;
      }
    } catch (err) {
      console.log(`[ERROR]: ${err}`);
      current.attempts++;
      if (current.attempts >= 1) {
        await updatePivotController(
          current.pivot_id,
          false,
          null,
          null,
          null,
          null,
          null,
          new Date(),
          null,
          null
        );
      }
    } finally {
      current = idleQueue.dequeue()!;
      idleQueue.enqueue(current);
    }
  }
  ready = true;
};

export const loadActions = async () => {
  const allActions = await readAllActionsController();

  for (let action of allActions) {
    activeQueue.enqueue({ action, attempts: 0, timestamp: new Date() });
  }
};

export const loadPivots = async () => {
  const allPivots = await readAllPivotsController2();

  for (let pivot of allPivots) {
    idleQueue.enqueue({
      pivot_id: pivot.pivot_id,
      radio_id: pivot.radio_id,
      attempts: 0
    });
  }
};

// Sends data to radio
// Returns the response
// The payload is a array of Decimal numbers, needs to be converted

// const checkPool = async () => {
//   ready = false;
//   if (fatherCounter < fatherUpdate) {
//     // console.log(
//     //   'Check Pool: ',
//     //   'IDLE: ',
//     //   idlePool.length,
//     //   ' ACTIVE: ',
//     //   activePool.length
//     // );
//     for (let activeIntent of activePool) {
//       console.log(
//         '[ACTIVE]\tSending data to pivot',
//         activeIntent.intent.radio_name
//       );

//       try {
//         const result = await sendData(activeIntent);
//         const { response, response_time } = result;
//         if (
//           response.status == 200 &&
//           response.data.id == activeIntent.intent.radio_name
//         ) {
//           activePool = activePool.filter((value) => value != activeIntent);

//           activeIntent.timestamp = new Date();
//           activeIntent.attempts = 0;
//           idlePool.push(activeIntent);
//           processResponse(
//             activeIntent.intent.radio_name,
//             activeIntent.intent,
//             response.data,
//             response_time
//           );
//         } else {
//           console.log(
//             `[ERROR]\tResposta de outro id: -> ${activeIntent.intent.radio_name} | -> ${response.data.id}`
//           );
//           activeIntent.attempts++;

//           if (activeIntent.attempts >= 5) {
//             await updatePivotController(
//               activeIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             activeIntent.attempts = 0;
//           }
//         }
//       } catch (err) {
//         console.log('[TIMEOUT]\ton', activeIntent.intent.radio_name);
//         activeIntent.attempts++;

//         activePool = activePool.filter((value) => value != activeIntent);

//         activeIntent.timestamp = new Date();
//         idlePool.push(activeIntent);

//         if (activeIntent.attempts >= 5) {
//           await updatePivotController(
//             activeIntent.intent.radio_name,
//             'OFFLINE'
//           );
//           activeIntent.attempts = 0;
//         }
//       }
//     }

//     for (let idleIntent of idlePool) {
//       if (
//         new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
//         8000
//       ) {
//         console.log(
//           '[IDLE]\tSending data to pivot',
//           idleIntent.intent.radio_name
//         );

//         try {
//           const result = await sendData(idleIntent);
//           const { response, response_time } = result;
//           if (
//             response.status == 200 &&
//             response.data.id == idleIntent.intent.radio_name
//           ) {
//             idleIntent.timestamp = new Date();
//             idleIntent.attempts = 0;
//             processResponse(
//               idleIntent.intent.radio_name,
//               idleIntent.intent,
//               response.data,
//               response_time
//             );
//           } else {
//             console.log(
//               `[ERROR]\tResposta de outro id: -> ${idleIntent.intent.radio_name} | -> ${response.data.id}`
//             );
//             idleIntent.attempts++;

//             if (idleIntent.attempts >= 5) {
//               await updatePivotController(
//                 idleIntent.intent.radio_name,
//                 'OFFLINE'
//               );
//               idleIntent.attempts = 0;
//             }
//           }
//         } catch (err) {
//           idleIntent.attempts++;
//           console.log('[TIMEOUT]\ton', idleIntent.intent.radio_name);

//           if (idleIntent.attempts >= 5) {
//             await updatePivotController(
//               idleIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             idleIntent.attempts = 0;
//           }
//         }
//       }
//     }
//   } else {
//     fatherCounter = 0;
//   }
//   fatherCounter++;
//   ready = true;
// };
