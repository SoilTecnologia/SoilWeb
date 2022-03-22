import { container, delay } from 'tsyringe';
import { FarmsRepository } from '../../database/repositories/Farms/FarmsRepository';
import { IFarmsRepository } from '../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../database/repositories/Nodes/INodesRepository';
import { NodesRepository } from '../../database/repositories/Nodes/NodesRepository';
import { IPivotsRepository } from '../../database/repositories/Pivots/IPivotsRepository';
import { PivotsRepository } from '../../database/repositories/Pivots/PivotsRepository';
import { IRadioVariableRepository } from '../../database/repositories/RadioVariables/IRadioVariableRepository';
import { RadioVariableRepository } from '../../database/repositories/RadioVariables/RadioVariablesRepository';
import { IStateRepository } from '../../database/repositories/States/IState';
import { StatesRepository } from '../../database/repositories/States/StatesRepository';
import { IStatesVariable } from '../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { StatesVariablesRepository } from '../../database/repositories/StatesVariables/StatesVariablesRepository';
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

container.registerSingleton<INodesRepository>(
  'NodesRepository',
  delay(() => NodesRepository)
);

container.registerSingleton<IStateRepository>(
  'StatesRepository',
  delay(() => StatesRepository)
);

container.registerSingleton<IStatesVariable>(
  'StatesVariablesRepository',
  delay(() => StatesVariablesRepository)
);

container.registerSingleton<IRadioVariableRepository>(
  'RadioVariablesRepository',
  delay(() => RadioVariableRepository)
);
