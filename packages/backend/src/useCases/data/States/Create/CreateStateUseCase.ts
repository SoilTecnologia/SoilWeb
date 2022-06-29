import { inject, injectable } from 'tsyringe';
import { StateModel } from '@database/model/State';
import { IStateRepository } from '@database/repositories/States/IState';
import emitter from '@utils/eventBus';
import { dateJs } from '@utils/handleDates/dateFactory';
import { messageErrorTryAction } from '@utils/types';

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
    const newState = {
      ...state,
      connection: state.connection || false,
      power: state.power || false
    };
    const stateModel = new StateModel();

    Object.assign(stateModel, {
      ...newState,
      timestamp: dateJs().tz().toDate()
    });

    const action = await this.applyQueryCreateState(stateModel);

    if (action) emitter.emit('action-update', { id: action.pivot_id });
    else emitter.emit('action-not-update', { id: stateModel.pivot_id });

    return action;
  }
}

export { CreateStateUseCase };
