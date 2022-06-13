import { UserModel } from '../../../model/User';

interface IFindByLogin{
  findByLogin(login: UserModel['login']): Promise<UserModel | undefined>;
}

export {IFindByLogin}