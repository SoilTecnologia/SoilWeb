import { container } from 'tsyringe';
import { iotDevice } from '../../../..';
import { GetOneNodeUseCase } from '../../../../useCases/Nodes/GetOneNode/GetOneNodeUseCase';
import { GetPivotByIdUseCase } from '../../../../useCases/Pivots/GetById/GetByIdUseCase';
import { UpdatePivotStateUseCase } from '../../../../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
import { GetPivotStateUseCase } from '../../../../useCases/States/GetPivotState/GetPivotStateUseCase';
import emitter from '../../../../utils/eventBus';
import { messageErrorTryAction } from '../../../../utils/types';
import { getPivotsGprs } from './utils/getPivotsGprs';

interface responseActive {
  id: string;
}
interface responseNotActiveProps extends responseActive {
  attempts: number;
}

class CheckGprsInterval {
  public responseActives: responseActive[];
  public responseNotActives: responseNotActiveProps[];

  constructor() {
    this.responseActives = [{} as responseActive];
    this.responseNotActives = [{} as responseNotActiveProps];
  }

  private getDate() {
    const catchDate = new Date();
    const dateString = catchDate.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
    const [date, hours] = dateString.split(' ');

    return { hours, date };
  }

  public addResponseStatus(pivot_id: string) {
    this.responseActives.push({ id: pivot_id });
  }

  private async getStatePivot(pivot_id: string, connection: boolean) {
    const getStateUseCase = container.resolve(GetPivotStateUseCase);
    const getUpdatePivotController = container.resolve(UpdatePivotStateUseCase);
    const getPivot = container.resolve(GetPivotByIdUseCase);
    const getNode = container.resolve(GetOneNodeUseCase);
    try {
      const oldState = await getStateUseCase.execute(pivot_id);

      if (oldState) {
        if (oldState.connection !== connection) {
          await getUpdatePivotController.execute(
            pivot_id,
            connection,
            false,
            false,
            'CLOCKWISE',
            0,
            0,
            new Date(),
            null,
            null
          );

          const pivot = await getPivot.execute(pivot_id);
          const node = await getNode.execute(pivot?.node_id!!);
          pivot &&
            node &&
            emitter.emit('connection-pivot', {
              id: `${pivot.farm_id}_${node.node_num}`,
              pivot_id,
              pivot_num: pivot.pivot_num,
              connection
            });
        }
      } else {
        await getUpdatePivotController.execute(
          pivot_id,
          connection,
          false,
          false,
          'CLOCKWISE',
          0,
          0,
          new Date(),
          null,
          null
        );
      }
    } catch (err) {
      messageErrorTryAction(
        err,
        false,
        CheckGprsInterval.name,
        'Atualizando Estado'
      );
    }
  }

  public async checkResponseActive(pivot_id: string) {
    const resActive = this.responseActives;
    const resNotActive = this.responseNotActives;

    const existsPivot = resActive.find((res) => res.id === pivot_id);

    if (existsPivot) {
      console.log(`Recebido resposta de ${pivot_id} enviando mensagem ativa`);
      this.responseActives = resActive.filter((res) => res.id !== pivot_id);

      await this.getStatePivot(pivot_id, true);
    } else {
      console.log(`Pivo fora do ar: ...${pivot_id}, `);
      const existsNotActive = resNotActive.find((res) => res.id === pivot_id);
      if (!existsNotActive) {
        console.log('Tentativas 1...');
        resNotActive.push({ id: pivot_id, attempts: 2 });
        const payload = {
          payload: '000-000',
          type: 'status',
          id: pivot_id
        };
        iotDevice.publish(payload, pivot_id);

        setTimeout(async () => {
          await this.checkResponseActive(pivot_id);
        }, 2000);
      } else {
        if (existsNotActive.attempts > 3) {
          await this.getStatePivot(pivot_id, false);

          this.responseNotActives = resNotActive.filter(
            (res) => res.id !== pivot_id
          );
          console.log(`Tentativas excedidas no pivo ${pivot_id}`);
          console.log('....');
          emitter.emit('action-ack-not-received', {
            id: pivot_id
          });
        } else {
          console.log(`Tentativa de conexão n° ${existsNotActive.attempts}`);
          const responseWithoutThis = resNotActive.filter(
            (res) => res.id !== pivot_id
          );
          responseWithoutThis.push({
            id: existsNotActive.id,
            attempts: existsNotActive.attempts + 1
          });
          this.responseNotActives = responseWithoutThis;
          const payload = {
            payload: '000-000',
            type: 'status',
            id: pivot_id
          };
          iotDevice.publish(payload, pivot_id);
          setTimeout(async () => {
            await this.checkResponseActive(pivot_id);
          }, 5000);
        }
      }
      // await this.getStatePivot(pivot_id, false)
    }
  }

  public async checkPivots() {
    this.getDate();
    // 10 minutos = 10000 * 6 * 10
    const timeout = 10000 * 6 * 10;

    setInterval(async () => {
      const pivots = await getPivotsGprs();
      const { hours, date } = this.getDate();

      if (pivots && pivots.length > 0) {
        console.log(`Checagem de Conexão inciada as ${hours} do dia ${date}`);
        console.log('....');
        for (const pivot of pivots) {
          const payload = {
            payload: '000-000',
            type: 'status',
            id: pivot.pivot_id
          };
          iotDevice.publish(payload, pivot.pivot_id);

          setTimeout(() => {
            this.checkResponseActive(pivot.pivot_id);
          }, 2000);
        }
      } else {
        console.log('Does Not Found Pivots GPRS');
      }

      console.log('...');
    }, timeout);
  }
}

const checkGprsInterval = new CheckGprsInterval();
export { checkGprsInterval };
