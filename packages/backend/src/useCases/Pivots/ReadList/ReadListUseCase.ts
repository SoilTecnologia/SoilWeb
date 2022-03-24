import { inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { PartialListResponse } from '../../../database/model/types/pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';

@injectable()
class ReadListPivotUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}

  async execute(farm_id: PivotModel['farm_id']) {
    const response: PartialListResponse[] = [];

    const pivots = await this.pivotRepository.getAll(farm_id);

    for (let pivot of pivots) {
      const state = await this.stateRepository.findByPivotId(pivot.pivot_id);
      const variable =
        state &&
        (await this.stateVariableRepository.findByStateId(state.state_id));

      const result: PartialListResponse = {
        pivot_id: pivot.pivot_id,
        pivot_num: pivot.pivot_num,
        power: state ? state.power : false,
        water: state ? state.water : false,
        direction: state ? state.direction : null,
        percentimeter: state && variable ? variable.percentimeter : null,
        rssi: null,
        father: null,
        timestamp: state && variable ? new Date(variable.timestamp) : null
      };
      response.push(result);
    }

    return response;
  }
}

export { ReadListPivotUseCase };
