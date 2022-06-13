import Axios from 'axios';
import 'reflect-metadata';
import '../shared/container';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import { Readable } from 'stream';
import emitter from '../utils/eventBus';
import GenericQueue from '../utils/generic_queue';
import { CheckStatusRadio } from './common/checkStatusRadio';
import { HandleActionActive } from './common/handleActionActive';
import { payloadToString } from './common/payloadToString';
import { ActionData, IdleData, RadioResponse } from './protocols';
import { loadActions, loadPivots } from './utils';

const TIMEOUT = 10000;

const activeQueue: GenericQueue<ActionData> = new GenericQueue<ActionData>(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
const idleQueue: GenericQueue<IdleData> = new GenericQueue<IdleData>(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

export const sendData = async (radio_id: number, data: string) => {
  const bodyFormData = new FormData();

  bodyFormData.set('ID', radio_id);
  // bodyFormData.set('CMD', '40');
  bodyFormData.set('intencao', data);
  const encoder = new FormDataEncoder(bodyFormData);
  const dataSend = Readable.from(encoder);

  const response = await Axios.post<RadioResponse>(
    `http://192.168.100.100:3031/comands`,
    dataSend,
    { headers: encoder.headers, timeout: TIMEOUT }
  );

  const result = payloadToString(response.data.payload);

  return { result, data: response.data };
};

export const checkPool = async () => {
  const actionIsActive = activeQueue.isEmpty();
  const checkStatus = idleQueue.isEmpty();

  if (!actionIsActive) {
    const startAction = new HandleActionActive(activeQueue);
    await startAction.startHandleAction();
  } else if (!checkStatus) {
    const startCheckState = new CheckStatusRadio(idleQueue);
    await startCheckState.startChechStatusRadio();
  }
};

export const start = async () => {
  await loadActions(activeQueue);
  await loadPivots(idleQueue);

  emitter.on('action', (action) => {
    activeQueue.enqueue({
      action: action.payload,
      timestamp: new Date(),
      attempts: 1
    });
  });

  // Seta um intervalo para ficar checando a pool
  // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo

  await checkPool();
};
