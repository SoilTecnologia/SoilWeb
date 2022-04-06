import { inject, injectable } from 'tsyringe';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteActionUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository
  ) {}

  private async applyQueryFindById(action_id: string) {
    try {
      return await this.actionRepository.findById(action_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteActionUseCase.name,
        'Find Action By Id'
      );
    }
  }

  private async applyQueryDelete(action_id: string) {
    try {
      return await this.actionRepository.delete(action_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteActionUseCase.name,
        'Delete Action By Id'
      );
    }
  }

  async execute(action_id: string) {
    const queryAlreadyExists = await this.applyQueryFindById(action_id);

    if (!queryAlreadyExists) throw new Error('Action does not found');

    const del = await this.applyQueryDelete(action_id);

    console.log(`action excluded for exceeding the limits of attempts`);
    console.log('');
  }
}

export { DeleteActionUseCase };
