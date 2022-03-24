import knex from '../..';
import { RadioVariableModel } from '../../model/RadioVariable';
import { IRadioVariableRepository } from './IRadioVariableRepository';

class RadioVariableRepository implements IRadioVariableRepository {
  async findByPivotId(
    pivot_id: string
  ): Promise<RadioVariableModel | undefined> {
    return await knex<RadioVariableModel>('radio_variables')
      .where({ pivot_id })
      .orderBy('timestamp', 'desc')
      .first();
  }

  async create(
    radio_variable: Omit<RadioVariableModel, 'radio_variable_id'>
  ): Promise<RadioVariableModel> {
    return await knex<RadioVariableModel>('radio_variables').insert(
      radio_variable
    );
  }
}

export { RadioVariableRepository };
