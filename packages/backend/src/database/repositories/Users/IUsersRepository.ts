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

  create({ login, password, user_type }: UserModel): Promise<User[]>;

  deleteUser(user_id: User['user_id']): Promise<number | undefined>;

  putUser(user: UserModel): Promise<User | undefined>;

  getAllUsers(): Promise<User[]>;
}

export { IUsersRepository, ResponseDTO };
