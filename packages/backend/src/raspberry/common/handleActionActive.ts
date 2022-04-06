import { container } from 'tsyringe';
import { ActionsResult } from '../../types/actionsType';
import { DeleteActionUseCase } from '../../useCases/Actions/DeleteAction/DeleteACtionUseCase';
import { UpdateActionsUseCase } from '../../useCases/Actions/UpdateActionUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import GenericQueue from '../../utils/generic_queue';
import { sendData } from '../tests';
import { objectToActionString } from './objectToActionString';

type ActionData = {
  action: ActionsResult;
  timestamp: Date;
  attempts: number;
};

class HandleActionActive {
  private attempts: number;

  private action: ActionsResult;

  private activeQueue: GenericQueue<ActionData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  private updateActionUseCase: UpdateActionsUseCase;

  private deleteActionUseCase: DeleteActionUseCase;

  constructor(activeQueue: GenericQueue<ActionData>) {
    this.activeQueue = activeQueue;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.updateActionUseCase = container.resolve(UpdateActionsUseCase);
    this.deleteActionUseCase = container.resolve(DeleteActionUseCase);
    const current = activeQueue.peek();
    this.action = current.action;

    this.attempts = current.attempts;
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

    this.attempts = 0;

    await this.updateActionUseCase.execute(this.action.action_id, true);
    console.log('UPDATING ACTION:', this.action.action_id);

    // Verificar se está deletando essa ação do array
    // Se não estiver procurar uma solução para isso
    this.activeQueue.dequeue();
  };

  returnFailled = async () => {
    if (this.attempts > 2) {
      console.log(
        `Failing PIVOT ${this.action.pivot_id} with Radio: ${this.action.radio_id}`
      );

      await this.getUpdatePivotController.execute(
        this.action.pivot_id,
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

      // await this.updateActionUseCase.execute(this.action.action_id, false);
      this.attempts = 0;
      this.activeQueue.dequeue()!;

      // Enviar mensagem para nuvem dizendo que o pivo falhou na atualização
    }
  };

  startHandleAction = async () => {
    console.log(`Numero de Tentativas ${this.attempts + 1}`);
    if (this.attempts > 2) {
      await this.returnFailled();
      return;
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
          this.attempts++;
          await this.startHandleAction();
        }
      }
    } catch (err) {
      console.log(`[ERROR - RASPBERRY.TEST]: ${err.message}`);
      console.log('');
      this.attempts++;

      await this.startHandleAction();
      this.attempts > 2 && (await this.returnFailled());
    }
  };
}

export { HandleActionActive };
