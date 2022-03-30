import { container } from 'tsyringe';
import { ActionModel } from '../../database/model/Action';
import { UpdateActionsUseCase } from '../../useCases/Actions/UpdateActionUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import GenericQueue from '../../utils/generic_queue';
import { sendData } from '../tests';
import { objectToActionString } from './objectToActionString';

type ActionData = {
  action: ActionModel;
  timestamp: Date;
  attempts: number;
};

class HandleActionActive {
  private action: ActionModel;

  private attempts: number;

  private activeQueue: GenericQueue<ActionData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  private updateActionUseCase: UpdateActionsUseCase;

  constructor(activeQueue: GenericQueue<ActionData>) {
    this.activeQueue = activeQueue;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.updateActionUseCase = container.resolve(UpdateActionsUseCase);
    const current: ActionData = activeQueue.peek();
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
    if (this.attempts > 4) {
      console.log('Failing PIVOT');
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

      await this.updateActionUseCase.execute(this.action.action_id, false);
      this.activeQueue.dequeue()!;
    }
  };

  startHandleAction = async () => {
    console.log('CHECKING ACTIVE');
    try {
      const { power, water, direction, percentimeter } = this.action;

      const actionString = objectToActionString(
        power,
        water,
        direction,
        percentimeter
      );

      console.log(
        `Sending Action to radio ${this.action.radio_id}: ${actionString}`
      );

      const { result, data } = await sendData(
        this.action.radio_id,
        actionString
      );

      const verifyResponseData = this.checkResponse(result.payload);
      const radioIsEquals = this.action.radio_id == data.id;
      const allDataValids = verifyResponseData && radioIsEquals && result.match;

      allDataValids
        ? this.updateActionWithCondicionsValid(result.payload)
        : this.attempts++;
    } catch (err) {
      this.attempts++;
      console.log(`[ERROR - RASPBERRY.TEST]: ${err}`);
    } finally {
      await this.returnFailled();
    }
  };
}

export { HandleActionActive };
