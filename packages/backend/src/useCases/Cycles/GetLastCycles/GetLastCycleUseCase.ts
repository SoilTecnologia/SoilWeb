import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../../database/model/State';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';

@injectable()
class GetLastCycleUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}

  async execute(pivot_id: StateModel['pivot_id']) {
    const lastState = await this.stateRepository.getLastState(pivot_id);

    if (lastState) {
      if (lastState.power === true) {
        const lastOff = await this.stateRepository.getLastOffState(pivot_id);

        if (lastOff) {
          return await this.stateRepository.beforeThat(
            pivot_id,
            lastOff.timestamp
          );
        }
      }
      if (lastState.power === false) {
        return await this.stateVariableRepository.getAnglePercentimeter(
          lastState.state_id
        );
      }
    }

    return [];
  }
}

export { GetLastCycleUseCase };
