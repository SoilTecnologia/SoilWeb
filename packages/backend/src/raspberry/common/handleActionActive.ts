import { container } from 'tsyringe';
import { ActionsResult } from '../../protocols/actionsType';
import { DeleteActionUseCase } from '../../useCases/Actions/DeleteAction/DeleteACtionUseCase';
import { UpdateActionsUseCase } from '../../useCases/Actions/UpdateActionUseCase';
import { GetOneNodeUseCase } from '../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { GetPivotByIdUseCase } from '../../useCases/Pivots/GetById/GetByIdUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { GetPivotStateUseCase } from '../../useCases/States/GetPivotState/GetPivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import emitter from '../../utils/eventBus';
import GenericQueue from '../../utils/generic_queue';
import { ActionDataWithCmd, ResponseSendData } from '../protocols';
import { checkPool, sendData } from '../tests';
import { objectToActionString } from './objectToActionString';

export type interval = (onOff: boolean) => void;

class HandleActionActive {
  private current: ActionDataWithCmd;

  private action: ActionsResult;

  private activeQueue: GenericQueue<ActionDataWithCmd>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  private updateActionUseCase: UpdateActionsUseCase;

  private deleteActionUseCase: DeleteActionUseCase;

  private getPivotUseCase: GetPivotByIdUseCase;

  private getNodeUseCase: GetOneNodeUseCase;

  private getStateUseCase: GetPivotStateUseCase;

  constructor(activeQueue: GenericQueue<ActionDataWithCmd>) {
    this.activeQueue = activeQueue;
    // this.intervalState = intervalState;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.updateActionUseCase = container.resolve(UpdateActionsUseCase);
    this.deleteActionUseCase = container.resolve(DeleteActionUseCase);
    this.getNodeUseCase = container.resolve(GetOneNodeUseCase);
    this.getPivotUseCase = container.resolve(GetPivotByIdUseCase);
    this.getStateUseCase = container.resolve(GetPivotStateUseCase);
    this.current = activeQueue.peek();
    this.action = this.current.action;
  }

  updateActionWithCondicionsValid = async (
    payload: StatusObject,
    active: ActionDataWithCmd
  ) => {
    // this.intervalState(false);

    const action = await this.getUpdatePivotController.execute(
      active.action.pivot_id,
      true,
      payload.power || false,
      payload.water || false,
      payload.direction || 'CLOCKWISE',
      payload.angle || 0,
      payload.percentimeter || 0,
      payload.timestamp || new Date(),
      '',
      null
    );

    action
      ? console.log('Action Atualizada com Sucesso')
      : console.log('Action não Atualizada');

    this.current.attempts = 1;
    active.attempts = 1;

    await this.updateActionUseCase.execute(this.action.action_id, true);
    console.log('UPDATING ACTION:', this.action.action_id);
    emitter.emit('action-received-ack', {
      id: active.action.pivot_id
    });

    // Verificar se está deletando essa ação do array
    // Se não estiver procurar uma solução para isso
    this.activeQueue.remove(active);
    this.activeQueue.dequeue();
    await checkPool();
  };

  returnFailled = async (active: ActionDataWithCmd) => {
    if (active.attempts > 3) {
      // this.intervalState(false);
      console.log('');
      console.log(
        `Failing PIVOT ${this.action.pivot_id} with Radio: ${this.action.radio_id}`
      );

      try {
        await this.getUpdatePivotController.execute(
          active.action.pivot_id,
          false,
          false,
          false,
          'CLOCKWISE',
          0,
          0,
          new Date(),
          '',
          0
        );
        await this.updateActionUseCase.execute(active.action.action_id, false);

        const { pivot_id, pivot_num } = active.action;
        await this.deleteActionUseCase.execute(active.action.action_id);

        // Pega dados para enviar notificação para nuvem
        const pivot = await this.getPivotUseCase.execute(
          active.action.pivot_id
        );

        // Checa se a conexão é falsa para enviar para nuvem
        const node = await this.getNodeUseCase.execute(pivot?.node_id!!);
        const oldState = await this.getStateUseCase.execute(pivot?.pivot_id);

        if (oldState.connection !== false) {
          node &&
            emitter.emit('connection-pivot', {
              id: `${active.action.farm_id}_${node.node_num}`,
              pivot_id,
              pivot_num,
              connection: false
            });
        }
      } catch (err) {
        const error = err as Error;
        console.log('ERROR IN Returns Failled');
        console.log(error.message);
      } finally {
        this.activeQueue.remove(this.current);
        emitter.emit('action-not-update', { id: active.action.pivot_id });
        await checkPool();
      }

      // Enviar mensagem para nuvem dizendo que o pivo falhou na atualização
    }
  };

  async logErrorTry(active: ActionDataWithCmd) {
    active.attempts && active.attempts++;
    if (active.attempts && active.attempts > 3)
      await this.returnFailled(active);
    else
      setTimeout(async () => {
        await this.sendItem(active);
      }, 5000);
  }

  async sendItem(active: ActionDataWithCmd) {
    console.log(`Numero de Tentativas ${active.attempts}`);
    console.log(
      `CHECKING ACTIVE IN ${this.action.radio_id} of the Pivot ${this.action.pivot_id}`
    );
    const { power, water, direction, percentimeter } = active.action;

    const actionString = objectToActionString(
      power!!,
      water!!,
      direction!!,
      percentimeter!!
    );

    console.log(
      `Sending Action to radio ${active.action.radio_id}: ${actionString}`
    );

    try {
      const response = await sendData(active.action.radio_id, actionString);
      const { data } = response;
      if (data.status === 'Fail') {
        const logReponse =
          data.status === 'Fail'
            ? `Radio ${active.action.radio_id} Not Connect`
            : `Failled in the Motherboard`;

        console.log(logReponse);
        console.log('.....');
        await this.logErrorTry(active);
      } else {
        console.log(`Radio: ${active.action.radio_id} received Status "Ok" `);
        console.log('......');
        await this.treatsResponses(response, active);
      }
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      await this.logErrorTry(active);
    }
  }

  async treatsResponses(response: ResponseSendData, active: ActionDataWithCmd) {
    if (response && response.result) {
      const { data, result } = response;

      const radioIsEquals = active.action.radio_id == data.id;
      const allDataValids = radioIsEquals && result;

      if (allDataValids) this.updateActionWithCondicionsValid(result, active);
      else {
        console.log('Failled in communication');
        console.log('');
        await this.logErrorTry(active);
      }
    }
  }

  startHandleAction = async () => {
    for (const active of this.activeQueue._store) {
      try {
        await this.sendItem(active);
      } catch (err) {
        const error = err as Error;
        console.log(`[ERROR - RASPBERRY.TEST]: ${error.message}`);
        console.log('');
        await this.logErrorTry(active);
      }
    }
  };
}

export { HandleActionActive };
