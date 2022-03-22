import { StateModel } from '../../model/State';
import { StateVariableModel } from '../../model/StateVariables';

interface IStatesVariable {
  findByStateId(
    state_id: StateModel['state_id']
  ): Promise<StateVariableModel | undefined>;

  create(
    stateVariable: Omit<StateVariableModel, 'state_variable_id'>
  ): Promise<StateVariableModel>;
}

export { IStatesVariable };
