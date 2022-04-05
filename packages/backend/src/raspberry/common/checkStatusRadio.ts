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

class CheckStatusRadio {
  private attempts: number;

  private pivot_id: string;

  private radio_id: number;

  private idleQueue: GenericQueue<IdleData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  constructor(idleQueue: GenericQueue<IdleData>) {
    this.idleQueue = idleQueue;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    const current: IdleData = idleQueue.peek();

    this.attempts = current.attempts;
    this.pivot_id = current.pivot_id;
    this.radio_id = current.radio_id;
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

  async checkFailurePivot() {
    if (this.attempts >= 4) {
      console.log("Mais de 4 tentativas")
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
    }

    this.idleQueue.dequeue()!;

    // this.idleQueue.enqueue(current);
  }

  startChechStatusRadio = async () => {
    console.log('CHECKING IDLE');
    console.log(`Checking radio ${this.radio_id}`);
    console.log('...........................................................');

    try {
      const {
        result,
        data: { id }
      } = await sendData(this.radio_id, '000-000');

      const matchIsNotEmpty = result.match && result.match !== '';
      const radioDataIsEquals = this.radio_id == id;
      const dataIsValid = matchIsNotEmpty && radioDataIsEquals;

      dataIsValid
        ? this.updateStateChageIsTrue(result.payload)
        : this.attempts++;
    } catch (err) {
      console.log(`[ERROR]: ${err}`);
      this.attempts++;
    } finally {
      await this.checkFailurePivot();
    }
  };
}

export { CheckStatusRadio };
