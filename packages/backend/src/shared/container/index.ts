import { container, delay } from 'tsyringe';
import { ActionRepository } from '@database/repositories/Action/ActionRepository';
import { IActionRepository } from '@database/repositories/Action/IActionRepository';
import { FarmsRepository } from '@database/repositories/Farms/FarmsRepository';
import { IFarmsRepository } from '@database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '@database/repositories/Nodes/INodesRepository';
import { NodesRepository } from '@database/repositories/Nodes/NodesRepository';
import { IPivotsRepository } from '@database/repositories/Pivots/IPivotsRepository';
import { PivotsRepository } from '@database/repositories/Pivots/PivotsRepository';
import { IRadioVariableRepository } from '@database/repositories/RadioVariables/IRadioVariableRepository';
import { RadioVariableRepository } from '@database/repositories/RadioVariables/RadioVariablesRepository';
import { IStateRepository } from '@database/repositories/States/IState';
import { StatesRepository } from '@database/repositories/States/StatesRepository';
import { IStatesVariableRepository } from '@database/repositories/StatesVariables/IStatesVariablesRepository';
import { StatesVariablesRepository } from '@database/repositories/StatesVariables/StatesVariablesRepository';
import { IUsersRepository } from '@database/repositories/Users/IUsersRepository';
import { UsersRepository } from '@database/repositories/Users/UserRepository';
import { ISchedulingRepository } from '@database/repositories/Scheduling/ISchedulingRepository';
import { SchedulingRepository } from '@database/repositories/Scheduling/SchedulingRepository';
import { ISchedulingAngleRepository } from '@database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { SchedulingAngleRepository } from '@database/repositories/SchedulingAngle/SchedulingAngleRepository';
import { PumpRepository } from '@database/repositories/Pump/PumpRepository';
import { IPumpRepository } from '@database/repositories/Pump/IPumpRepository';
import { ISchedulingHistoryRepository } from '@database/repositories/SchedulingHistory/ISchedulingHistoryRepository';
import { SchedulingHistoryRepository } from '@database/repositories/SchedulingHistory/SchedulingHistoryRepository';
import { SchedulingAngleHistRepository } from '@database/repositories/SchedulingAngleHist/SchedulingAngleHistRepository';
import { ISchedulingAngleHistRepository } from '@database/repositories/SchedulingAngleHist/ISchedulingAngleHistRepository';
import { AddNewUserRepo } from '@database/repositories/Users/AddUser/AddNewUserRepository';
import { FindUserByLoginRepo } from '@database/repositories/Users/FindByLogin/FindByLoginRTepository';
import { ICreateUserRepository } from '@database/protocols/users/create-user/create-user';
import { IFindUserByLoginRepo } from '@database/protocols/users/find-user-by-login/IFindByLoginRepository';
import {
  ICompareEncrypt,
  IEncrypter
} from '../../useCases/data/User/utils/encrypted-password/protocols';
import { BcryptAdapter } from '@useCases/data/User/utils/encrypted-password/bcrypter-adapter';
import { ITokenJwt } from '@useCases/data/User/utils/token-jwt/protocols';
import { CreateJwt } from '@useCases/data/User/utils/token-jwt';
import { BCryptCompare } from '@useCases/data/User/utils/encrypted-password/compare-encrypted';
import { IDeleteUserRepo } from '@database/protocols/users/delete-user/IDeleteUser';
import { DeleteUserRepo } from '@database/repositories/Users/DeleteUser/DeleteUserRepository';
import { IFindUserByIdRepo } from '@database/protocols/users/find-by-id/IFindByIdRepository';
import { FindUserByIdRepo } from '@database/repositories/Users/FindById/FindByIdRepository';

//Users
container.register<ICreateUserRepository>('AddUser', AddNewUserRepo);
container.register<IFindUserByIdRepo>('FindUserById', FindUserByIdRepo);
container.register<IDeleteUserRepo>('DeleteUser', DeleteUserRepo);
container.register<IFindUserByLoginRepo>(
  'FindUserByLogin',
  FindUserByLoginRepo
);

//Encrypter
container.register<IEncrypter>('Encrypter', BcryptAdapter);
container.register<ICompareEncrypt>('CompareEncrypt', BCryptCompare);

//Token Jwt
container.register<ITokenJwt>('TokenJwt', CreateJwt);

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

container.registerSingleton<INodesRepository>(
  'NodesRepository',
  delay(() => NodesRepository)
);

container.registerSingleton<IStateRepository>(
  'StatesRepository',
  delay(() => StatesRepository)
);

container.registerSingleton<IStatesVariableRepository>(
  'StatesVariablesRepository',
  delay(() => StatesVariablesRepository)
);

container.registerSingleton<IRadioVariableRepository>(
  'RadioVariablesRepository',
  delay(() => RadioVariableRepository)
);

container.registerSingleton<IActionRepository>(
  'ActionsRepository',
  delay(() => ActionRepository)
);

container.registerSingleton<ISchedulingRepository>(
  'SchedulingRepository',
  delay(() => SchedulingRepository)
);
container.registerSingleton<ISchedulingAngleRepository>(
  'SchedulingAngleRepository',
  delay(() => SchedulingAngleRepository)
);

container.registerSingleton<IPumpRepository>(
  'PumpRepository',
  delay(() => PumpRepository)
);

container.registerSingleton<ISchedulingHistoryRepository>(
  'SchedulingHistoryRepository',
  delay(() => SchedulingHistoryRepository)
);

container.registerSingleton<ISchedulingAngleHistRepository>(
  'SchedulingAngleHistRepository',
  delay(() => SchedulingAngleHistRepository)
);
