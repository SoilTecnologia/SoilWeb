import { inject } from 'tsyringe';
import { ActionModel } from '../../database/model/Action';
import { IActionRepository } from '../../database/repositories/Action/IActionRepository';

class UpdateActionsUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  async execute(action_id: ActionModel['action_id'], success: boolean) {
    await this.actionRepository.update(action_id, success);
  }
}

export { UpdateActionsUseCase };
