import { container, delay } from 'tsyringe';
import { FarmsRepository } from '../../database/repositories/Farms/FarmsRepository';
import { IFarmsRepository } from '../../database/repositories/Farms/IFarmsRepository';
import { IPivotsRepository } from '../../database/repositories/Pivots/IPivotsRepository';
import { PivotsRepository } from '../../database/repositories/Pivots/PivotsRepository';
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
container.registerSingleton<IPivotsRepository>(
  'PivotsRepository',
  delay(() => PivotsRepository)
);
