import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../../../database/model/State';
import { IStateRepository } from '../../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { dateSaoPaulo } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetLastCycleUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}

  async getAnglePercents(state_id: string) {
    try {
      return await this.stateVariableRepository.getAnglePercentimeter(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetLastCycleUseCase.name,
        'Get Angle Percents'
      );
    }
  }

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
        await this.getAnglePercents(lastState.state_id);
      }
    }

    return [];
  }
}

export { GetLastCycleUseCase };
