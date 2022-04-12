import { inject, injectable } from 'tsyringe';
import { IActionRepository } from '../../../database/repositories/Action/IActionRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteAllActionsUseCase {
  constructor(
    @inject('ActionsRepository') private actionRepository: IActionRepository,
    @inject('UsersRepository') private userRepository: IActionRepository
  ) {}

  private async applyQueryFindUserById(action_id: string) {
    try {
      return await this.userRepository.findById(action_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteAllActionsUseCase.name,
        'Find User By Id'
      );
    }
  }

  private async applyQueryDeleteAll(user_id: string) {
    try {
      return await this.actionRepository.deleteAll(user_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        DeleteAllActionsUseCase.name,
        'Delete Action By Id'
      );
    }
  }

  async execute(user_id: string) {
    const userAlreadyExists = await this.applyQueryFindUserById(user_id);

    if (!userAlreadyExists) throw new Error('User does not found');

    const del = await this.applyQueryDeleteAll(user_id);

    return del;
  }
}

export { DeleteAllActionsUseCase };
