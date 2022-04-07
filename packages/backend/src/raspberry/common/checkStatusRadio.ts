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
  private current: IdleData;

  private pivot_id: string;

  private radio_id: number;

  private idleQueue: GenericQueue<IdleData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  constructor(idleQueue: GenericQueue<IdleData>) {
    this.idleQueue = idleQueue;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.current = this.idleQueue.peek();

    this.pivot_id = this.current.pivot_id;
    this.radio_id = this.current.radio_id;
  }

  private resetCurrent() {
    this.current = this.idleQueue.dequeue()!;
    this.idleQueue.enqueue(this.current);
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

    // this.resetCurrent();
    console.log('........................................................');
  }

  async sendFaillureRadio() {
    if (this.current.attempts > 3) {
      console.log(`Failing Pivot  ${this.pivot_id} in Radio ${this.radio_id}`);
      console.log('........................................................');
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

      this.current.attempts = 1;
      this.resetCurrent();
    }

    this.resetCurrent();
    // this.resetCurrent();
  }

  startChechStatusRadio = async () => {
    console.log('CHECKING IDLE');
    console.log(`Ǹumero de tentativa ${this.current.attempts}`);
    console.log(
      `Checking radio ${this.radio_id} of the Pivot ${this.pivot_id}`
    );

    console.log('...');

    try {
      const { data, result } = await sendData(this.radio_id, '000-000');

      const radioDataIsEquals = this.radio_id == data.id;

      if (result && radioDataIsEquals) this.updateStateChageIsTrue(result);
      else this.current.attempts++;
    } catch (err) {
      console.log(`[ERROR]: ${err}`);
      console.log('.......................................................');
      this.current.attempts++;
    } finally {
      await this.sendFaillureRadio();
    }
  };
}

export { CheckStatusRadio };
