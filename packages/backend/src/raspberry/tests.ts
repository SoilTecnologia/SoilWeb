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
import { UpdatePivotStateUseCase } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import emitter from '../utils/eventBus';
import GenericQueue from '../utils/generic_queue';
import { HandleActionActive } from './common/handleActionActive';
import { payloadToString } from './common/payloadToString';

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

export const sendData = async (radio_id: number, data: string) => {
  const bodyFormData = new FormData();

  bodyFormData.set('ID', radio_id);
  // bodyFormData.set('CMD', '40');
  bodyFormData.set('intencao', data);
  const encoder = new FormDataEncoder(bodyFormData);

  const response = await Axios.post<RadioResponse>(
    'http://192.168.100.100:3031/comands',
    Readable.from(encoder),
    { headers: encoder.headers, timeout: TIMEOUT }
  );

  const result = payloadToString(response.data.payload);

  return { result, data: response.data };
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

  ready = false;
  const actionIsActive = !activeQueue.isEmpty();

  if (actionIsActive) {
    const startAction = new HandleActionActive(activeQueue);
    await startAction.startHandleAction();
  } else if (!idleQueue.isEmpty()) {
    let current = idleQueue.peek();
    console.log('CHECKING IDLE');

    try {
      console.log(`Checking radio ${current.radio_id}`);
      console.log('');
      const { result, data } = await sendData(current.radio_id, '000-000');

      if (result.match && current.radio_id == data.id) {
        await getUpdatePivotController.execute(
          current.pivot_id,
          true,
          result.payload.power,
          result.payload.water,
          result.payload.direction,
          result.payload.angle,
          result.payload.percentimeter,
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
