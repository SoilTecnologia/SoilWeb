import knex from '@root/database';
import { IGetPivotStateAndVariablesRepo } from '@root/database/protocols/pivots/get-states';

class GetPivotStateAndVariablesRepo {
  async get({
    pivot_id
  }: IGetPivotStateAndVariablesRepo.Params): Promise<IGetPivotStateAndVariablesRepo.Response> {
    const value: IGetPivotStateAndVariablesRepo.DataFullPivot | undefined =
      await knex('states')
        .where('states.pivot_id', pivot_id)
        .orderBy('timestamp', 'desc')
        .select(
          'state_variable_id',
          'states.state_id',
          'state_variables.angle',
          'state_variables.percentimeter',
          'state_variables.timestamp'
        )
        .join('state_variables', 'states.state_id', 'state_variables.state_id')
        .first();

    return value;
  }
}

export { GetPivotStateAndVariablesRepo };
