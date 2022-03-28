import Axios from 'axios';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import 'reflect-metadata';
import { Readable } from 'stream';
import { container } from 'tsyringe';
import { ActionModel } from '../database/model/Action';
import { PivotsRepository } from '../database/repositories/Pivots/PivotsRepository';
import '../shared/container';
import { GetAllActionsUseCase } from '../useCases/Actions/GetAllActions/GetAllActionUseCase';
import { UpdateActionsUseCase } from '../useCases/Actions/UpdateActionUseCase';
import { UpdatePivotStateUseCase } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import {
  objectToActionString,
  StatusObject,
  statusStringToObject
} from '../utils/conversions';
import emitter from '../utils/eventBus';
import GenericQueue from '../utils/generic_queue';

const TIMEOUT = 10000;

type ActionData = {
  action: ActionModel;
  timestamp: Date;
  attempts: number;
};

type IdleData = {
  pivot_id: string;
  radio_id: number;
  attempts: number;
};
type RadioResponse = {
  cmd: number;
  id: number;
  payload: Array<number>;
  status: string;
};

const activeQueue: GenericQueue<ActionData> = new GenericQueue<ActionData>(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
const idleQueue: GenericQueue<IdleData> = new GenericQueue<IdleData>(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

const sendData = async (radio_id: number, data: string) => {
  const bodyFormData = new FormData();

  bodyFormData.set('ID', radio_id);
  // bodyFormData.set('CMD', '40');
  bodyFormData.set('intencao', data);
  const encoder = new FormDataEncoder(bodyFormData);

  // let response = await Axios.post<RadioResponse>(
  //   'http://localhost:8080/comands',
  //   Readable.from(encoder),
  //   { headers: encoder.headers, timeout: TIMEOUT }
  // );
  const response = await Axios.post<RadioResponse>(
    'http://192.168.100.101:3031/comands',
    Readable.from(encoder),
    { headers: encoder.headers, timeout: TIMEOUT }
  );

  return response;
};

const checkResponse = (action: ActionModel, payload: StatusObject) => {
  if (payload) {
    if (action.power) {
      // Se nossa intenção era ligar, checamos todo o payload
      if (
        payload.power == action.power &&
        payload.water == action.water &&
        payload.direction == action.direction
      )
        return true;
    } else {
      // Caso contrário checamos apenas se o estado do pivo e da bomba, sem levar em conta a direction
      if (payload.power == action.power && payload.water == action.water)
        return true;
    }
  }

  return false;
};

export const loadActions = async () => {
  const readPivots = container.resolve(GetAllActionsUseCase);
  const allActions = await readPivots.execute();

  for (const action of allActions) {
    activeQueue.enqueue({ action, attempts: 0, timestamp: new Date() });
  }
};

export const loadPivots = async () => {
  const getAllPivots = new PivotsRepository();
  const allPivots = await getAllPivots.findAll();

  for (const pivot of allPivots) {
    idleQueue.enqueue({
      pivot_id: pivot.pivot_id,
      radio_id: pivot.radio_id,
      attempts: 0
    });
  }
};

const checkPool = async () => {
  const getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
  const updateActionUseCase = container.resolve(UpdateActionsUseCase);

  ready = false;
  if (!activeQueue.isEmpty()) {
    console.log('CHECKING ACTIVE');
    const current = activeQueue.peek();

    try {
      const { power, water, direction, percentimeter } = current.action;
      const actionString = objectToActionString(
        power,
        water,
        direction,
        percentimeter
      );
      console.log(
        `Sending Action to radio ${current.action.radio_id}: ${actionString}`
      );
      const response = await sendData(current.action.radio_id, actionString);
      const { data } = response;

      const { payload } = data;
      // const payloadToString = String.fromCharCode(...payload);
      const payloadToString = new TextDecoder().decode(new Uint8Array(payload));

      const payloadObject = statusStringToObject(
        payloadToString.substring(0, payloadToString.indexOf('#'))
      );

      if (
        payloadObject &&
        current.action.radio_id == data.id &&
        checkResponse(current.action, payloadObject)
      ) {
        await getUpdatePivotController.execute(
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
        current.attempts = 0;

        console.log('UPDATING ACTION:', current.action.action_id);
        await updateActionUseCase.execute(current.action.action_id, true);
        activeQueue.dequeue();
      } else {
        current.attempts++;
      }
    } catch (err) {
      current.attempts++;
      console.log(`[ERROR - RASPBERRY.TEST]: ${err}`);
    } finally {
      if (current.attempts > 4) {
        console.log('Failing PIVOT');
        await getUpdatePivotController.execute(
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
        const removed = activeQueue.dequeue()!;
        await updateActionUseCase.execute(removed.action.action_id, false);
      }
    }
  } else if (!idleQueue.isEmpty()) {
    let current = idleQueue.peek();
    console.log('CHECKING IDLE');

    try {
      console.log(`Checking radio ${current.radio_id}`);
      const response = await sendData(current.radio_id, '000000');
      const { data } = response;

      const { payload } = data;
      const payloadToString = new TextDecoder().decode(new Uint8Array(payload));
      const payloadObject = statusStringToObject(
        payloadToString.substring(0, payloadToString.indexOf('#'))
      );

      if (payloadObject && current.radio_id == data.id) {
        await getUpdatePivotController.execute(
          current.pivot_id,
          true,
          payloadObject.power,
          payloadObject.water,
          payloadObject.direction,
          payloadObject.angle,
          payloadObject.percentimeter,
          new Date(),
          null,
          null
        );
        current.attempts = 0;
      } else {
        current.attempts++;
      }
    } catch (err) {
      console.log(`[ERROR]: ${err}`);
      current.attempts++;
    } finally {
      if (current.attempts >= 10) {
        console.log('Failing PIVOT');
        await getUpdatePivotController.execute(
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

      current = idleQueue.dequeue()!;
      idleQueue.enqueue(current);
    }
  }
  ready = true;
};

export const start = async () => {
  loadActions();
  loadPivots();

  emitter.on('action', (action) => {
    activeQueue.enqueue({
      action: action.payload,
      timestamp: new Date(),
      attempts: 0
    });
  });

  // Seta um intervalo para ficar checando a pool
  // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo
  setInterval(() => {
    if (ready) checkPool();
  }, 5000);
};

/*
Checa se a resposta da placa é igual à uma action que mandamos à ela
*/

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
