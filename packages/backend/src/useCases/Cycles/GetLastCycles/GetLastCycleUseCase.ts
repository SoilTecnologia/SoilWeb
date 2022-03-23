import { inject, injectable } from 'tsyringe';
import knex from '../../../database';
import { StateModel } from '../../../database/model/State';
import { IStateRepository } from '../../../database/repositories/States/IState';
import StateVariable from '../../../models/stateVariable';

@injectable()
class GetLastCycleUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository
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
        return await knex<StateVariable>('state_variables')
          .select('angle', 'percentimeter')
          .where('state_id', lastState.state_id);
      }
    }

    return [];
  }
}

export { GetLastCycleUseCase };
