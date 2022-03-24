import { UserModel } from '../../model/User';

type ResponseDTO = {
  user_type: UserModel['user_type'];
  user_id: UserModel['user_id'];
  token: string;
};

interface IUsersRepository {
  findByLogin(login: UserModel['login']): Promise<UserModel | undefined>;
  findById(login: UserModel['login']): Promise<UserModel | undefined>;

  signInController(
    login: UserModel['login'],
    password: UserModel['password']
  ): Promise<ResponseDTO | null>;

  create({ login, password, user_type }: UserModel): Promise<UserModel[]>;

  deleteUser(user_id: UserModel['user_id']): Promise<number | undefined>;

  putUser(user: UserModel): Promise<UserModel | undefined>;

  getAllUsers(): Promise<UserModel[]>;
}

export { IUsersRepository, ResponseDTO };
