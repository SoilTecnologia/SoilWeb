import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../database/model/State';
import { IStateRepository } from '../../database/repositories/States/IState';
import { messageErrorTryAction } from '../../utils/types';

@injectable()
class CreateStateUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository
  ) {}

  private async applyQueryCreateState(state: StateModel) {
    try {
      return this.stateRepository.create(state);
    } catch (err) {
      messageErrorTryAction(err, true, CreateStateUseCase.name, 'Create State');
    }
  }

  async execute(state: Omit<StateModel, 'state_id'>) {
    const stateModel = new StateModel();
    Object.assign(stateModel, {
      ...state,
      timestamp: new Date()
    });

    return await this.applyQueryCreateState(stateModel);
  }
}

export { CreateStateUseCase };
