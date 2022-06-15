import {
  ICreateUserRepository,
  IFindUserByLogin
} from '@database/protocols/users';
import { IUserRepoFactory } from '@root/database/protocols/users/user-factory';
import { inject, injectable } from 'tsyringe';

@injectable()
class UserFactoryRepository implements IUserRepoFactory {
  constructor(
    @inject('AddUser') private addUserRepo: ICreateUserRepository,
    @inject('FindUserByLogin') private finUserByLoginRepo: IFindUserByLogin
  ) {}

  findUserByLogin: IFindUserByLogin = this.finUserByLoginRepo;
  addUser: ICreateUserRepository = this.addUserRepo;
}

export { UserFactoryRepository };
