import knex from '../..';
import { StateVariableModel } from '../../model/StateVariables';
import { IStatesVariable } from './IStatesVariablesRepository';

class StatesVariablesRepository implements IStatesVariable {
  async findByStateId(
    state_id: string
  ): Promise<StateVariableModel | undefined> {
    return await knex<StateVariableModel>('state_variables')
      .where({ state_id })
      .orderBy('timestamp', 'desc')
      .first();
  }

  async create(
    stateVariable: Omit<StateVariableModel, 'state_variable_id'>
  ): Promise<StateVariableModel> {
    return await knex<StateVariableModel>('state_variables').insert(
      stateVariable
    );
  }
}

export { StatesVariablesRepository };
