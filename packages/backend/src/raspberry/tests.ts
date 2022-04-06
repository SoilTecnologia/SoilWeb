import Axios from 'axios';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import 'reflect-metadata';
import { Readable } from 'stream';
import { container } from 'tsyringe';
import { PivotModel } from '../database/model/Pivot';
import '../shared/container';
import { ActionsResult } from '../types/actionsType';
import { GetAllActionsUseCase } from '../useCases/Actions/GetAllActions/GetAllActionUseCase';
import { GetOneNodeUseCase } from '../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { FindAllUseCase } from '../useCases/Pivots/FindAll/FindAllUseCase';
import emitter from '../utils/eventBus';
import GenericQueue from '../utils/generic_queue';
import { CheckStatusRadio } from './common/checkStatusRadio';
import { HandleActionActive } from './common/handleActionActive';
import { payloadToString } from './common/payloadToString';

const TIMEOUT = 10000;

type ActionData = {
  action: ActionsResult;
  timestamp: Date;
  attempts: number;
};

type IdleData = {
  pivot_id: string;
  radio_id: number;
  attempts: number;
};

export type RadioResponse = {
  cmd: number;
  id: number;
  payload: Array<number>;
  status: string;
};

const activeQueue: GenericQueue<ActionData> = new GenericQueue<ActionData>(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
const idleQueue: GenericQueue<IdleData> = new GenericQueue<IdleData>(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;
0;

const filterPivotsGateway = async (
  pivots: PivotModel[]
): Promise<PivotModel[]> => {
  const getNode = container.resolve(GetOneNodeUseCase);
  const allPivots: PivotModel[] = [];
  for (const pivot of pivots) {
    const node = await getNode.execute(pivot.node_id!!);
    if (node?.node_num === 0) allPivots.push(pivot);
  }

  return allPivots;
};

const filterActionGateway = async (actions: ActionsResult[]) => {
  const getNode = container.resolve(GetOneNodeUseCase);
  const allActions: ActionsResult[] = [];
  for (const action of actions) {
    const node = await getNode.execute(action.node_id!!);
    if (node?.node_num === 0) allActions.push(action);
  }

  return allActions;
};

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
  const actions = await readPivots.execute();
  const allActions = await filterActionGateway(actions!!);

  for (const action of allActions!!) {
    console.log(action);
    activeQueue.enqueue({ action, attempts: 1, timestamp: new Date() });
  }
};

export const loadPivots = async () => {
  const getAllPivots = container.resolve(FindAllUseCase);
  const pivots = await getAllPivots.execute();

  const allPivots = await filterPivotsGateway(pivots!!);

  for (const pivot of allPivots) {
    idleQueue.enqueue({
      pivot_id: pivot.pivot_id,
      radio_id: pivot.radio_id,
      attempts: 1
    });
  }
};

const checkPool = async () => {
  ready = false;
  const actionIsActive = activeQueue.isEmpty();
  const checkStatus = idleQueue.isEmpty();

  if (!actionIsActive) {
    const startAction = new HandleActionActive(activeQueue);
    await startAction.startHandleAction();
    ready = true;
  } else if (!checkStatus) {
    const startCheckState = new CheckStatusRadio(idleQueue);
    await startCheckState.startChechStatusRadio();
    ready = true;
  }
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
