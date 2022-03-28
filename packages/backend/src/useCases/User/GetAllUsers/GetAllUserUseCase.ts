import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';
import { InvalidCredentials } from '../../../types/errors';

@injectable()
class GetAllUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  async execute() {
    try {
      const users = await this.userRepository.getAllUsers();
      if (!users) throw new Error('No user found');

      return users;
    } catch (err) {
      throw new InvalidCredentials();
    }
  }
}

export { GetAllUserUseCase };
