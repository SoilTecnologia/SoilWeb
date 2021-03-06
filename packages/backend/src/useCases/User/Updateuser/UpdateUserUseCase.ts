import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { IUsersRepository } from '../../../database/repositories/Users/IUsersRepository';

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  async execute({ login, password, user_type, user_id }: UserModel) {
    const userModel = new UserModel();
    const selectUser = await this.userRepository.findById(user_id!!);

    if (selectUser) {
      Object.assign(userModel, {
        user_id: user_id || selectUser.user_id,
        login: login || selectUser.login,
        password: password || selectUser.password,
        user_type: user_type || selectUser.user_type
      });

      const newUser = await this.userRepository.putUser(userModel);

      return newUser;
    }
  }
}

export { UpdateUserUseCase };
