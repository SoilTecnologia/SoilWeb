import { ICreateUserRepository } from './create-user/create-user';
import { IFindUserByLogin } from './find-user-by-login/IFindByLoginRepository';

interface IUserRepoFactory {
  addUser: ICreateUserRepository;
  findUserByLogin: IFindUserByLogin;
}

export { IUserRepoFactory };
