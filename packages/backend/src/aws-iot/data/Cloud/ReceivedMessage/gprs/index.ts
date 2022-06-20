import { container } from 'tsyringe';
import { UpdatePivotStateUseCase } from '@useCases/data/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { statusPayloadStringToObject } from '@utils/conversions';
import { messageErrorTryAction } from '@utils/types';

const handleGprs = async (payload: any, pivot_id: string) => {
  const updateStatePivot = container.resolve(UpdatePivotStateUseCase);

  if (payload) {
    console.log(`Received status from GPRS in Pivot ${pivot_id}`);
    const statusObject = statusPayloadStringToObject(payload);
    console.log(JSON.stringify(statusObject));

    if (statusObject) {
      try {
        await updateStatePivot.execute(
          pivot_id, // Como node_num == pivot_num, seria o mesmo que colocar farm_id_pivot_num
          true,
          statusObject.power,
          statusObject.water,
          statusObject.direction,
          statusObject.angle,
          statusObject.percentimeter,
          statusObject.timestamp,
          null,
          null
        );
      } catch (err) {
        messageErrorTryAction(
          err,
          false,
          'HandleGprs cloud',
          'Update State in Aws message'
        );
      }
    }
  } else {
    console.log('Status Changed Connection Received from Aws');
    console.log('........');
    return false;
  }
};

export { handleGprs };
