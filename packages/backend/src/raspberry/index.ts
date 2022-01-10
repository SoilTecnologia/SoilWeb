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
import { readAllActionsController, updateActionController } from '../controllers/actions';
import Action from '../models/action';

const TIMEOUT = 10000;

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
    activeQueue.enqueue({ action: action.payload, timestamp: new Date(), attempts: 0 });
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
  console.log("TRYING TO SEND DATA to radio", radio_id);

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
    'http://192.168.100.104:3031/comands',
    Readable.from(encoder),
    { headers: encoder.headers, timeout: TIMEOUT }
  );

  console.log("SENT!!")

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
      const actionString = objectToActionString(power, water, direction, percentimeter);
      console.log('SENDING ACTION: ', actionString);
      const request = await sendData(
        current.action.radio_id,
        actionString 
      );
      console.log("SENT")
      const payload = request.data.payload;
      // const payloadToString = String.fromCharCode(...payload);
      const payloadToString = new TextDecoder().decode(new Uint8Array(payload));
      const payloadObject = statusStringToObject(payloadToString.substring(0, payloadToString.indexOf('#')));
      console.log("RECEIVED")
      console.log(payloadObject)

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

        console.log("UPDATING ACTION:", current.action.action_id);
        await updateActionController(current.action.action_id, true);
        activeQueue.dequeue();
      }
    } catch (err) {
      console.log(`[ERROR - RASPBERRY.TEST]: ${err}`);

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
        const removed = activeQueue.dequeue()!;
        await updateActionController(removed.action.action_id, false);
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
      const payloadToString = new TextDecoder().decode(new Uint8Array(payload));
      const payloadObject = statusStringToObject(payloadToString.substring(0, payloadToString.indexOf('#')));
      console.log("RECEIVED")
      console.log(payloadObject)

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
    console.log(action)
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