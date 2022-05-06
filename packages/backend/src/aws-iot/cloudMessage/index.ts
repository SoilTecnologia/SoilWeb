import { container } from 'tsyringe';
import { GetPivotByIdUseCase } from '../../useCases/Pivots/GetById/GetByIdUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { statusPayloadStringToObject } from '../../utils/conversions';
import { handleResultString } from '../../utils/handleFarmIdWithUndescores';
import { messageErrorTryAction } from '../../utils/types';

type handleCloudProps = {
  pivot_id: string;
  payload: any;
};

class HandleCloudMessage {
  private pivot_id: handleCloudProps['pivot_id'];
  private payload: handleCloudProps['payload'];
  private getPivotUseCase: GetPivotByIdUseCase;
  private updateStatePivot: UpdatePivotStateUseCase;

  async receivedStatus({ pivot_id, payload }: handleCloudProps) {
    this.pivot_id = pivot_id;
    this.payload = payload;
    this.getPivotUseCase = container.resolve(GetPivotByIdUseCase);
    this.updateStatePivot = container.resolve(UpdatePivotStateUseCase);

    const { node_num } = await handleResultString(this.pivot_id);
    // Se possui um pivot_num, é um concentrador
    // Caso contrário podemos assumir que é um GPRS
    try {
      const pivotExists = await this.getPivotUseCase.execute(this.pivot_id);
      if (pivotExists) {
        if (node_num === '0') {
          // Concentrador
          if (this.payload) {
            try {
              await this.updateStatePivot.execute(
                this.pivot_id,
                this.payload.connection,
                this.payload.power,
                this.payload.water,
                this.payload.direction,
                this.payload.angle,
                this.payload.percentimeter,
                this.payload.timestamp,
                this.payload.father,
                this.payload.rssi
              );
              return true;
            } catch (err) {
              messageErrorTryAction(
                err,
                false,
                HandleCloudMessage.name,
                'Update Pivot State in received status'
              );
            }
            /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
          } else {
            console.log('Status Changed Connection Received from Aws');
            console.log('........');
            return false;
          }
        } else {
          // GPRS
          if (this.payload) {
            console.log(`Received status from GPRS in Pivot ${this.pivot_id}`);
            const statusObject = statusPayloadStringToObject(this.payload);

            // const pivotNum = `${farm_id}_${pivot_num}`;

            if (statusObject) {
              try {
                await this.updateStatePivot.execute(
                  this.pivot_id, // Como node_num == pivot_num, seria o mesmo que colocar farm_id_pivot_num
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
                  HandleCloudMessage.name,
                  'Update State in Aws message'
                );
              }
            }
          } else {
            console.log('Status Changed Connection Received from Aws');
            console.log('........');
            return false;
          }
        }
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        HandleCloudMessage.name,
        'Received Status'
      );
      return false;
    }
  }
}
const handleCloudMessage = new HandleCloudMessage();

export { handleCloudMessage };
