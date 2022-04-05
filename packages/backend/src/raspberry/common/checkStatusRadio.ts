import { container } from 'tsyringe';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import GenericQueue from '../../utils/generic_queue';
import { sendData } from '../tests';

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

class CheckStatusRadio {
  private attempts: number;

  private pivot_id: string;

  private radio_id: number;

  private idleQueue: GenericQueue<IdleData>;

  private dataSend: RadioResponse | null;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  constructor(idleQueue: GenericQueue<IdleData>) {
    this.idleQueue = idleQueue;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    const current: IdleData = idleQueue.peek();

    this.attempts = current.attempts;
    this.pivot_id = current.pivot_id;
    this.radio_id = current.radio_id;
    this.dataSend = null;
  }

  async updateStateChageIsTrue(payload: StatusObject) {
    await this.getUpdatePivotController.execute(
      this.pivot_id,
      true,
      payload.power,
      payload.water,
      payload.direction,
      payload.angle,
      payload.percentimeter,
      new Date(),
      null,
      null
    );
    this.attempts = 0;
  }

  async sendFaillureRadio() {
    if (this.attempts >= 4) {
      console.log('Mais de 4 tentativas');
      console.log('Failing PIVOT');
      // Tratar de enviar esse stats de falha de conexão com pivo para nuvem
      // E a nuvem mandar confirmação para o concentrador *ACK
      await this.getUpdatePivotController.execute(
        this.pivot_id,
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

      this.attempts = 0;
      this.idleQueue.dequeue()!;
    }
  }

  startChechStatusRadio = async () => {
    if (this.attempts > 3) this.sendFaillureRadio();
    console.log('CHECKING IDLE');
    console.log(
      `Checking radio ${this.radio_id} of the Pivot ${this.pivot_id}`
    );
    console.log('...........................................................');

    try {
      const { result, data } = await sendData(this.radio_id, '000-000');
      // if(stateResult){
      this.dataSend = data;

      const radioDataIsEquals = this.radio_id == data.id;

      if (result && radioDataIsEquals) this.updateStateChageIsTrue(result);
      else {
        this.attempts++;
        setTimeout(() => {
          this.startChechStatusRadio();
        }, 2000);
      }

      const current = this.idleQueue.dequeue()!;
      this.attempts < 4 && this.idleQueue.enqueue(current);
    } catch (err) {
      console.log(`[ERROR]: ${err}`);
      this.attempts++;
    } finally {
      this.dataSend = null;
    }
  };
}

export { CheckStatusRadio };
