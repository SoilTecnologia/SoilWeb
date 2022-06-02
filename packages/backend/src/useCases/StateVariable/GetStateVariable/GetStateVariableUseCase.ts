import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { dateString } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetStateVariableUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}
  private async applyQueryGetStateVariable(state_id: string) {
    try {
      return await this.stateVariableRepository.findByStateId(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
    }
  }
  private async applyQueryGetState(pivot_id: string) {
    try {
      return await this.stateRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
    }
  }
  private async applyQueryGetPivotById(pivot_id: string) {
    try {
      return await this.pivotRepository.findById(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
    }
  }

  async execute(pivot_id: string) {
    const pivot = await this.applyQueryGetPivotById(pivot_id);
    if (!pivot) throw new Error('Does not found pivot');

    const state = await this.applyQueryGetState(pivot_id);
    if (!state) return null;
    else {
      const stateVariable = await this.applyQueryGetStateVariable(
        state.state_id
      );

      Object.assign(stateVariable,{
        ...stateVariable,
        timestamp: dateString(stateVariable?.timestamp)
      })
      
      return stateVariable;
    }
  }
}

export { GetStateVariableUseCase };
