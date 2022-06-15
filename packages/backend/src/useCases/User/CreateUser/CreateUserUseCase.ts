import { inject, injectable } from 'tsyringe';
import { UserModel } from '../../../database/model/User';
import { ICreateUserRepository, ICreateUserUseCase } from '../../../database/protocols/users';
import { AlreadyExistsError, DatabaseError, DatabaseErrorReturn, DATABASE_ERROR, FailedCreateDataError } from '../../../protocols/errors';
import {messageErrorTryAction } from '../../../utils/types';
import { IEncrypter } from '../utils/encrypted-password/protocols';
import { ITokenJwt } from '../utils/token-jwt/protocols';

@injectable()
class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    @inject("TokenJwt") private tokenJwt: ITokenJwt,
    @inject("Encrypter") private encrypter: IEncrypter,
    @inject('UsersRepository') private userRepository: ICreateUserUseCase.Dependencies,
  ) {}

  private async apllyQueryFindUser(login: UserModel['login'])
    : Promise<UserModel | undefined | DatabaseError > {
    try {
      return await this.userRepository.findUserByLogin(login);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        "FindUser By Login"
      )
      return DATABASE_ERROR
    }
  }

  private async apllyQueryCreateUser(user: ICreateUserUseCase.Params)
    : Promise<ICreateUserRepository.Response | DatabaseError>  {
    try {
      return await this.userRepository.create(user);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        CreateUserUseCase.name,
        'CREATE NEW USER'
      );
      return DATABASE_ERROR
    }
  }

  async execute(user: ICreateUserUseCase.Params): Promise<ICreateUserUseCase.Response> {
    const {password, login, user_type} = user
    const encryptedPassword = await this.encrypter.encrypt(password);

    const userALreadyExists = await this.apllyQueryFindUser(login.toLowerCase());
    
    if (userALreadyExists === DATABASE_ERROR) throw new DatabaseErrorReturn()
    else if (userALreadyExists) throw new AlreadyExistsError("User")
    else{
      const userModel = new UserModel();

      Object.assign(userModel, {
        login: login.toLowerCase(),
        password: encryptedPassword,
        user_type
      });

      const newUser = await this.apllyQueryCreateUser(userModel);
      
      if(newUser === DATABASE_ERROR) throw new DatabaseErrorReturn()
      else if(!newUser) throw new FailedCreateDataError("User")
      else{
        const token = await this.tokenJwt.create(newUser)

        if(!token) throw new Error("Does not create token jwt")
        else return {user_id: newUser.user_id, user_type: newUser.user_type, token }
      }
    
    }
  }

}

export { CreateUserUseCase };
