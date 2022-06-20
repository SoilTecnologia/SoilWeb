import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../../database/model/User';
import { IUsersRepository } from '../../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class UpdateUserUseCase {
  constructor(
    @inject('UsersRepository') private userRepository: IUsersRepository
  ) {}

  private async apllyQueryGetUserById(user_id: string) {
    try {
      return await this.userRepository.findById(user_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        UpdateUserUseCase.name,
        'Find User By Id'
      );
    }
  }

  private async apllyQueryUpdateUser(userModel: UserModel) {
    try {
      return await this.userRepository.putUser(userModel);
    } catch (err) {
      messageErrorTryAction(err, true, UpdateUserUseCase.name, 'Update User');
    }
  }

  async execute({ login, password, user_type, user_id }: UserModel) {
    const userModel = new UserModel();
    const selectUser = await this.apllyQueryGetUserById(user_id!!);

    if (selectUser) {
      Object.assign(userModel, {
        user_id: user_id || selectUser.user_id,
        login: login || selectUser.login,
        password: password || selectUser.password,
        user_type: user_type || selectUser.user_type
      });

      const newUser = await this.apllyQueryUpdateUser(userModel);

      return newUser;
    }

    throw new Error('User does not find');
  }
}

export { UpdateUserUseCase };
