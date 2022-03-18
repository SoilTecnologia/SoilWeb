import User from '../../../models/user';
import { UserModel } from '../../model/User';

type ResponseDTO = {
  user_type: User['user_type'];
  user_id: User['user_id'];
  token: string;
};

interface IUsersRepository {
  findByLogin(login: User['login']): Promise<User | undefined>;
  findById(login: User['login']): Promise<User | undefined>;

  signInController(
    login: User['login'],
    password: User['password']
  ): Promise<ResponseDTO | null>;

  // create(
  //   login: User['login'],
  //   password: User['password'],
  //   user_type: User['user_type'],
  // ): Promise<ResponseDTO | null>;

  create({ login, password, user_type }: UserModel): Promise<User[]>;

  deleteUserController(user_id: User['user_id']): Promise<number | undefined>;

  putUserController(user: User): Promise<User | undefined>;

  getAllUsersController(): Promise<User[]>;
}

export { IUsersRepository, ResponseDTO };
