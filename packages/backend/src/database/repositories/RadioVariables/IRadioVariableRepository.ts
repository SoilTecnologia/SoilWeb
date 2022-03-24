import { RadioVariableModel } from '../../model/RadioVariable';

interface IRadioVariableRepository {
  findByPivotId(
    pivot_id: RadioVariableModel['pivot_id']
  ): Promise<RadioVariableModel | undefined>;

  create(
    radio_variable: Omit<RadioVariableModel, 'radio_variable_id'>
  ): Promise<RadioVariableModel>;
}

export { IRadioVariableRepository };
