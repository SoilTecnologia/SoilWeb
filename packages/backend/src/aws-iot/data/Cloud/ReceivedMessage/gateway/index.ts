import { container } from 'tsyringe';
import { UpdatePivotStateUseCase } from '@useCases/data/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { messageErrorTryAction } from '@utils/types';

const handleGateway = async (payload: any, pivot_id: string) => {
  const updateStatePivot = container.resolve(UpdatePivotStateUseCase);
  if (payload) {
    try {
      const updatedState = await updateStatePivot.execute(
        pivot_id,
        payload.connection,
        payload.power,
        payload.water,
        payload.direction,
        payload.angle,
        payload.percentimeter,
        payload.timestamp,
        payload.father,
        payload.rssi
      );
      return updatedState;
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        'HandleGateway Cloud',
        'Update Pivot State in received status'
      );
      return false;
    }
    /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
  } else {
    console.log('Status Changed Connection Received from Aws');
    console.log('........');
    return false;
  }
};

export { handleGateway };
