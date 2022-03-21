import { inject, injectable } from 'tsyringe';
import { UsersRepository } from '../../../database/repositories/Users/UserRepository';
import { InvalidCredentials } from '../../../types/errors';

@injectable()
class GetAllUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: UsersRepository
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
