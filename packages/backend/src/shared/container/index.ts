import { container, delay } from 'tsyringe';
import { IUsersRepository } from '../../database/repositories/Users/IUsersRepository';
import { UsersRepository } from '../../database/repositories/Users/UserRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository)
);
