import { container } from 'tsyringe';
import { ActionsResult } from '../../types/actionsType';
import { DeleteActionUseCase } from '../../useCases/Actions/DeleteAction/DeleteACtionUseCase';
import { UpdateActionsUseCase } from '../../useCases/Actions/UpdateActionUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import GenericQueue from '../../utils/generic_queue';
import { checkPool, sendData } from '../tests';
import { objectToActionString } from './objectToActionString';

type ActionData = {
  action: ActionsResult;
  timestamp: Date;
  attempts: number;
};

export type interval = (onOff: boolean) => void;

class HandleActionActive {
  private current: ActionData;

  private action: ActionsResult;

  private activeQueue: GenericQueue<ActionData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  private updateActionUseCase: UpdateActionsUseCase;

  private deleteActionUseCase: DeleteActionUseCase;

  constructor(activeQueue: GenericQueue<ActionData>) {
    this.activeQueue = activeQueue;
    // this.intervalState = intervalState;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.updateActionUseCase = container.resolve(UpdateActionsUseCase);
    this.deleteActionUseCase = container.resolve(DeleteActionUseCase);
    this.current = activeQueue.peek();
    this.action = this.current.action;
  }

  checkResponse = (payload: StatusObject) => {
    if (payload) {
      const actionPower =
        this.action.power &&
        payload.power == this.action.power &&
        payload.water == this.action.water &&
        payload.direction == this.action.direction;

      const actionNotPower =
        !this.action.power &&
        payload.power == this.action.power &&
        payload.water == this.action.water;

      if (actionNotPower && actionPower) return true;
    }

    return false;
  };

  updateActionWithCondicionsValid = async (
    payload: StatusObject,
    active: ActionData
  ) => {
    // this.intervalState(false);
    await this.getUpdatePivotController.execute(
      active.action.pivot_id,
      true,
      payload.power,
      payload.water,
      payload.direction,
      payload.angle,
      payload.percentimeter,
      payload.timestamp,
      '',
      null
    );

    this.current.attempts = 1;

    await this.updateActionUseCase.execute(this.action.action_id, true);
    console.log('UPDATING ACTION:', this.action.action_id);

    // Verificar se está deletando essa ação do array
    // Se não estiver procurar uma solução para isso
    this.activeQueue.remove(this.current);
    await checkPool();
  };

  returnFailled = async (active: ActionData) => {
    if (active.attempts > 3) {
      // this.intervalState(false);
      console.log('');
      console.log(
        `Failing PIVOT ${this.action.pivot_id} with Radio: ${this.action.radio_id}`
      );

      const pivot_id = active.action.pivot_id;

      await this.getUpdatePivotController.execute(
        pivot_id,
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

      try {
        await this.deleteActionUseCase.execute(active.action.action_id);
      } catch (err) {
        console.log('ERROR IN DELETE ACTIONS');
        console.log(err.message);
      } finally {
        this.activeQueue.remove(this.current);
        await checkPool();
      }

      // Enviar mensagem para nuvem dizendo que o pivo falhou na atualização
    }
  };

  async sendItem(active: ActionData) {
    console.log(`Numero de Tentativas ${this.current.attempts}`);
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

    const response = await sendData(active.action.radio_id, actionString);

    return response;
  }

  startHandleAction = async () => {
    for (const active of this.activeQueue._store) {
      try {
        const resultSendItem = await this.sendItem(active);

        if (resultSendItem) {
          const { data, result } = resultSendItem;

          const verifyResponseData = result && this.checkResponse(result);
          const radioIsEquals = active.action.radio_id == data.id;
          const allDataValids = verifyResponseData && radioIsEquals && result;

          if (allDataValids)
            this.updateActionWithCondicionsValid(result, active);
          else {
            this.current && this.current.attempts && this.current.attempts++;
            console.log('Failled in communication');
            console.log('');
            if (active.attempts && active.attempts > 3)
              await this.returnFailled(active);
            else
              setTimeout(async () => {
                await this.sendItem(active);
              }, 5000);
          }
        }
      } catch (err) {
        active.attempts && active.attempts++;
        console.log(`[ERROR - RASPBERRY.TEST]: ${err.message}`);
        console.log('');
        if (active.attempts && this.current.attempts > 3)
          await this.returnFailled(active);
        else
          setTimeout(async () => {
            await this.sendItem(active);
          }, 5000);
      }
    }
  };
}

export { HandleActionActive };
