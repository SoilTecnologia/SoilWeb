import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';

@injectable()
class DeleteUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  async execute(user_id: string) {
    const selectUser = await this.userRepository.findById(user_id!!);
    if (selectUser) {
      const newUser = await this.userRepository.deleteUser(user_id);

      return newUser;
    }
    throw new Error('User does not exists');
  }
}

export { DeleteUserUseCase };
