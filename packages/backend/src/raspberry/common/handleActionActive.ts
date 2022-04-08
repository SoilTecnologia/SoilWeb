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

  private intervalState: interval;

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

  updateActionWithCondicionsValid = async (payload: StatusObject) => {
    // this.intervalState(false);
    await this.getUpdatePivotController.execute(
      this.action.pivot_id,
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
    this.current = this.activeQueue.dequeue()!;
    this.activeQueue.remove(this.current);
    await checkPool();
  };

  returnFailled = async () => {
    if (this.current.attempts > 3) {
      // this.intervalState(false);
      console.log('');
      console.log(
        `Failing PIVOT ${this.action.pivot_id} with Radio: ${this.action.radio_id}`
      );

      const pivot_id = this.action.pivot_id;

      this.current = this.activeQueue.dequeue()!;
      this.activeQueue.remove(this.current);

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
        await this.deleteActionUseCase.execute(this.action.action_id);
      } catch (err) {
        console.log('ERROR IN DELETE ACTIONS');
        console.log(err.message);
      }

      // Enviar mensagem para nuvem dizendo que o pivo falhou na atualização
    }

    await checkPool();
  };

  startHandleAction = async () => {
    console.log(`Numero de Tentativas ${this.current.attempts}`);
    if (this.current.attempts > 3) {
      await this.returnFailled();
    }
    console.log(
      `CHECKING ACTIVE IN ${this.action.radio_id} of the Pivot ${this.action.pivot_id}`
    );
    try {
      const { power, water, direction, percentimeter } = this.action;

      const actionString = objectToActionString(
        power!!,
        water!!,
        direction!!,
        percentimeter!!
      );

      console.log(
        `Sending Action to radio ${this.action.radio_id}: ${actionString}`
      );

      const response = await sendData(this.action.radio_id, actionString);

      if (response) {
        const { data, result } = response;
        const verifyResponseData = result && this.checkResponse(result);
        const radioIsEquals = this.action.radio_id == data.id;
        const allDataValids = verifyResponseData && radioIsEquals && result;

        if (allDataValids) this.updateActionWithCondicionsValid(result);
        else {
          this.current.attempts++;
          await this.startHandleAction();
        }
      }
    } catch (err) {
      this.current && this.current.attempts && this.current.attempts++;
      if (this.current && this.current.attempts > 3) await this.returnFailled();
      console.log(`[ERROR - RASPBERRY.TEST]: ${err.message}`);
      console.log('');
      await this.startHandleAction();
    }
  };
}

export { HandleActionActive };
