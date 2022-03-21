import { container, delay } from 'tsyringe';
import { FarmsRepository } from '../../database/repositories/Farms/FarmsRepository';
import { IFarmsRepository } from '../../database/repositories/Farms/IFarmsRepository';
import { IUsersRepository } from '../../database/repositories/Users/IUsersRepository';
import { UsersRepository } from '../../database/repositories/Users/UserRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository)
);
container.registerSingleton<IFarmsRepository>(
  'FarmsRepository',
  delay(() => FarmsRepository)
);
