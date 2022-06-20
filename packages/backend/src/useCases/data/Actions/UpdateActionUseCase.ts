import { inject, injectable } from 'tsyringe';
import { ActionModel } from '../../../database/model/Action';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class UpdateActionsUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  private async applyQueryUpdateAction(action_id: string, success: boolean) {
    try {
      return await this.actionRepository.update(action_id, success);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateActionsUseCase.name,
        'Update Action'
      );
    }
  }

  async execute(action_id: ActionModel['action_id'], success: boolean) {
    return await this.applyQueryUpdateAction(action_id, success);
  }
}

export { UpdateActionsUseCase };
