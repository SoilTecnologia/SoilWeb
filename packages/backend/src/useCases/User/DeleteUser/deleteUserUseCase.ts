import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  private async apllyQueryFindUser(user_id: string) {
    try {
      return await this.userRepository.findById(user_id!!);
    } catch (err) {
      messageErrorTryAction(err, true, 'Find User By Id');
    }
  }

  private async applyQueryDeleteUser(user_id: string) {
    try {
      return await this.userRepository.deleteUser(user_id);
    } catch (err) {
      messageErrorTryAction(err, true, 'DELETE USER');
    }
  }

  async execute(user_id: string) {
    const selectUser = await this.apllyQueryFindUser(user_id);

    if (selectUser) {
      return await this.applyQueryDeleteUser(user_id);
    }

    throw new Error('User does not exists');
  }
}

export { DeleteUserUseCase };
