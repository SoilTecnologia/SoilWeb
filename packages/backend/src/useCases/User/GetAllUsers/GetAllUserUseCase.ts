import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../utils/types';

@injectable()
class GetAllUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  private async applyQueryGetUsers() {
    try {
      return await this.userRepository.getAllUsers();
    } catch (err) {
      messageErrorTryAction(err, true, 'Get All Users');
    }
  }

  async execute() {
    const users = await this.applyQueryGetUsers();

    if (!users) throw new Error('No user found');

    return users;
  }
}

export { GetAllUserUseCase };
