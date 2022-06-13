import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import process from 'process';
import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../../database/model/User';
import { IAddNewUser } from '../../../../database/repositories/Users/AddUser/IAddNewUser';
import { IFindByLogin } from '../../../../database/repositories/Users/FindByLogin/IFindByLoginRepository';
import { IUsersRepository } from '../../../../database/repositories/Users/IUsersRepository';
import { messageErrorTryAction } from '../../../../utils/types';
import { AddUserModel, ICreateUserUseCase, UserResponse } from '../protocols/ICreateUser';



@injectable()
class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject('UsersRepository') private addUserRepository: IAddNewUser,
    @inject('UsersRepository') private userRepository: IFindByLogin,

  ) {}

  private createJwt(user: UserModel) {
    const secret = process.env.NODE_ENV === "test" ? "testsoil" : process.env.TOKEN_SECRET
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_type: user.user_type
      },
      secret as jwt.Secret ,
      {
        expiresIn: '2h'
      }
    );

    const response = {
      user_id: user.user_id,
      user_type: user.user_type,
      token
    };

    return response;
  }

  private async apllyQueryFindUser(login: UserModel['login']) {
    try {
      return await this.userRepository.findByLogin(login);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        'FIND USER EXISTS'
      );
    }
  }

  private async apllyQueryCreateUser(user: AddUserModel) {
    try {
      return await this.addUserRepository.create(user);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        'CREATE NEW USER'
      );
    }
  }

  async execute({ login, password, user_type }: AddUserModel): Promise<UserResponse> {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const userALreadyExists = await this.apllyQueryFindUser(
      login.toLowerCase()
    );

    const userModel = new UserModel();

    if (userALreadyExists)
      throw new Error('This Users already exists in database');

    Object.assign(userModel, {
      login: login.toLowerCase(),
      password: encryptedPassword,
      user_type
    });

    const newUser = await this.apllyQueryCreateUser(userModel);

    if(!newUser)throw new Error('Failed to create user')
    else{
      const userResponse = this.createJwt(newUser) 
      return userResponse
    }
    
  }
}

export { CreateUserUseCase };
