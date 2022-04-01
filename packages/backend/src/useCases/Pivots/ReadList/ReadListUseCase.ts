import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { PartialListResponse } from '../../../database/model/types/pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class ReadListPivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}

  private async applyQueryStateByPivotId(pivot_id: string) {
    try {
      return await this.stateRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadListPivotUseCase.name,
        'Get State pivot'
      );
    }
  }

  private async applyQueryStateVariableByStateId(state_id: string) {
    try {
      return await this.stateVariableRepository.findByStateId(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadListPivotUseCase.name,
        'Get StateVariable of the State'
      );
    }
  }

  private async applyQueryGetAllPivot(farm_id: string) {
    try {
      return await this.pivotRepository.getAll(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadListPivotUseCase.name,
        'Get All pivots'
      );
    }
  }

  async execute(farm_id: PivotModel['farm_id']) {
    const response: PartialListResponse[] = [];

    const pivots = await this.applyQueryGetAllPivot(farm_id);

    if (pivots) {
      for (let pivot of pivots!!) {
        const state = await this.applyQueryStateByPivotId(pivot.pivot_id);
        const variable =
          state &&
          (await this.applyQueryStateVariableByStateId(state.state_id));

        const result: PartialListResponse = {
          pivot_id: pivot.pivot_id,
          pivot_num: pivot.pivot_num,
          power: state ? state.power : false,
          water: state ? state.water : false,
          direction: state ? state.direction : null,
          connection: state ? state.connection : false,
          percentimeter: state && variable ? variable.percentimeter : null,
          rssi: null,
          father: null,
          timestamp: state && variable ? new Date(variable.timestamp) : null
        };

        response.push(result);
      }

      return response;
    }

    return [] as PartialListResponse[];
  }
}

export { ReadListPivotUseCase };
