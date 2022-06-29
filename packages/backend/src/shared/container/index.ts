import { container, delay } from 'tsyringe';
import { ActionRepository } from '@database/repositories/Action/ActionRepository';
import { IActionRepository } from '@database/repositories/Action/IActionRepository';
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

//Encrypters and Tokens
import {
  IEncrypter,
  BcryptAdapter,
  BCryptCompare,
  ICompareEncrypt,
  CreateJwt,
  ITokenJwt
} from '@useCases/data/User';

// Implementations Repositories
import {
  GetFarmByUserIdRepo,
  GetPivotByIdRepo,
  GetAllBaseRepo,
  GetByIdBaseRepo,
  CreateBaseRepo,
  DeleteBaseRepo,
  GetByDataRepo,
  UpdateBaseRepo,
  GetByfarmAndNodeNumRepo,
  GetAllByDataBaseRepo
} from '@database/repositories/';

// Protocols Repositories
import {
  IGetFarmByUserIdRepo,
  IGetPivotByIdRepo,
  IGetAllBaseRepo,
  IGetByIdBaseRepo,
  ICreateBaseRepo,
  IDeleteBaseRepo,
  IUpdateBaseRepo,
  IGetByDataRepo,
  IGetByFarmAndNodeNumRepo,
  IGetAllByDataBaseRepo
} from '@database/protocols/';

// Base
container.register<IGetAllBaseRepo>('GetAllBase', GetAllBaseRepo);
container.register<IGetByIdBaseRepo>('GetByIdBase', GetByIdBaseRepo);
container.register<ICreateBaseRepo>('CreateBaseRepo', CreateBaseRepo);
container.register<IGetByDataRepo>('GetByData', GetByDataRepo);
container.register<IDeleteBaseRepo>('DeleteBase', DeleteBaseRepo);
container.register<IUpdateBaseRepo>('UpdateBase', UpdateBaseRepo);
container.register<IGetAllByDataBaseRepo>(
  'GetAllByDataBase',
  GetAllByDataBaseRepo
);

//Encrypter
container.register<IEncrypter>('Encrypter', BcryptAdapter);
container.register<ICompareEncrypt>('CompareEncrypt', BCryptCompare);

//Token Jwt
container.register<ITokenJwt>('TokenJwt', CreateJwt);

// Farms
container.register<IGetFarmByUserIdRepo>('GetFarmByUser', GetFarmByUserIdRepo);

//Nodes
container.register<IGetByFarmAndNodeNumRepo>(
  'GetByFarmAndNodeNum',
  GetByfarmAndNodeNumRepo
);

// Pivots
container.register<IGetPivotByIdRepo>('GetPivotById', GetPivotByIdRepo);

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
