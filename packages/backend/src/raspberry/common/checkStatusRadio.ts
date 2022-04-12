import { container } from 'tsyringe';
import { GetOneNodeUseCase } from '../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { GetPivotByIdUseCase } from '../../useCases/Pivots/GetById/GetByIdUseCase';
import { GetOnePivotUseCase } from '../../useCases/Pivots/GetOnePivot/GetOnePivotUseCase';
import { UpdatePivotStateUseCase } from '../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { StatusObject } from '../../utils/conversions';
import emitter from '../../utils/eventBus';
import GenericQueue from '../../utils/generic_queue';
import { checkPool, sendData } from '../tests';

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

export type interval = (onOff: boolean) => void;

class CheckStatusRadio {
  private current: IdleData;

  private pivot_id: string;

  private radio_id: number;

  private idleQueue: GenericQueue<IdleData>;

  private getUpdatePivotController: UpdatePivotStateUseCase;

  private getPivot: GetPivotByIdUseCase;

  private getNode: GetOneNodeUseCase;

  private intervalState: interval;

  constructor(idleQueue: GenericQueue<IdleData>) {
    this.idleQueue = idleQueue;
    // this.intervalState = intervalState;
    this.getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    this.getPivot = container.resolve(GetPivotByIdUseCase);
    this.getNode = container.resolve(GetOneNodeUseCase);
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
        false,
        false,
        'CLOCKWISE',
        0,
        0,
        new Date(),
        '',
        0
      );

      const pivot = await this.getPivot.execute(this.pivot_id);
      const node = await this.getNode.execute(pivot?.node_id!!);
      pivot &&
        node &&
        emitter.emit('fail', {
          id: `${pivot.farm_id}_${node.node_num}`,
          pivot_id: this.pivot_id,
          pivot_num: pivot.pivot_num
        });
      this.current.attempts = 1;
      this.resetCurrent();
    }

    this.resetCurrent();
    setTimeout(async () => {
      await checkPool();
    }, 5000);
    // this.intervalState(true);

    // this.resetCurrent();
  }

  startChechStatusRadio = async () => {
    // this.intervalState(false);
    console.log('CHECKING IDLE');
    console.log(`Ǹumero de tentativa ${this.current.attempts}`);
    console.log(
      `Checking radio ${this.radio_id} of the Pivot ${this.pivot_id}`
    );

    try {
      const { data, result, cmdResponse } = await sendData(
        this.radio_id,
        '000-000'
      );
      console.log(`Radio Response: ${cmdResponse.data}`);
      console.log('......');

      const radioDataIsEquals = this.radio_id == data.id;

      if (result && radioDataIsEquals) this.updateStateChageIsTrue(result);
      else this.current.attempts++;
    } catch (err) {
      // this.intervalState(false);
      console.log(`[ERROR]: ${err}`);
      console.log('.......................................................');
      this.current.attempts++;
    } finally {
      await this.sendFaillureRadio();
    }
  };
}

export { CheckStatusRadio };
