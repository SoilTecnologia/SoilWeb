import knex from '../..';
import { StateVariableModel } from '../../model/StateVariables';
import { IStatesVariableRepository } from './IStatesVariablesRepository';

class StatesVariablesRepository implements IStatesVariableRepository {
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
    const statsVariable = await knex<StateVariableModel>('state_variables')
      .insert(stateVariable)
      .returning('*');

    return statsVariable[0];
  }

  async getAnglePercentimeter(
    state_id: string
  ): Promise<Pick<StateVariableModel, 'angle' | 'percentimeter'>[]> {
    return await knex<StateVariableModel>('state_variables')
      .select('angle', 'percentimeter')
      .where('state_id', state_id);
  }

  async getVariableGroupBy(
    state_id: string
  ): Promise<
    Pick<StateVariableModel, 'angle' | 'percentimeter' | 'timestamp'>[]
  > {
    return await knex<StateVariableModel>('state_variables')
      .select('percentimeter', 'timestamp' /* 'AVG(percentimeter)') */)
      .where('state_id', state_id)
      .groupBy('angle', 'percentimeter', 'timestamp')
      .orderBy('timestamp', 'asc');
  }

  async updateAngle(
    state_id: string,
    angle: number | null
  ): Promise<StateVariableModel> {
    return await knex<StateVariableModel>('state-variable')
      .select('angle')
      .where('state_variable_id', state_id)
      .update({ angle });
  }

  async updatePercentimeter(
    state_id: string,
    percentimeter: number | null
  ): Promise<StateVariableModel> {
    return await knex<StateVariableModel>('state-variable')
      .select('percentimeter')
      .where('state_variable_id', state_id)
      .update({ percentimeter });
  }
}

export { StatesVariablesRepository };
