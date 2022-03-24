import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../database/model/State';
import { IStateRepository } from '../../database/repositories/States/IState';

@injectable()
class CreateStateUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository
  ) {}

  async execute(state: Omit<StateModel, 'state_id'>) {
    const stateModel = new StateModel();
    Object.assign(stateModel, {
      ...state,
      timestamp: new Date()
    });

    const newState = this.stateRepository.create(stateModel);

    return newState;
  }
}

export { CreateStateUseCase };
