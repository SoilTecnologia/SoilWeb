import { container, delay } from 'tsyringe';
import { ActionRepository } from '../../database/repositories/Action/ActionRepository';
import { IActionRepository } from '../../database/repositories/Action/IActionRepository';
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
import { IStatesVariableRepository } from '../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { StatesVariablesRepository } from '../../database/repositories/StatesVariables/StatesVariablesRepository';
import { IUsersRepository } from '../../database/repositories/Users/IUsersRepository';
import { UsersRepository } from '../../database/repositories/Users/UserRepository';
import { ISchedulingRepository } from '../../database/repositories/Scheduling/ISchedulingRepository';
import { SchedulingRepository } from '../../database/repositories/Scheduling/SchedulingRepository';
import { ISchedulingAngleRepository } from '../../database/repositories/SchedulingAngle/ISchedulingAngleRepository';
import { SchedulingAngleRepository } from '../../database/repositories/SchedulingAngle/SchedulingAngleRepository';
import { PumpRepository } from '../../database/repositories/Pump/PumpRepository';
import { IPumpRepository } from '../../database/repositories/Pump/IPumpRepository';

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
