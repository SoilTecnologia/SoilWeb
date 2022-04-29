import { RadioVariableModel } from '../database/model/RadioVariable';
import { StateModel } from '../database/model/State';
import { StateVariableModel } from '../database/model/StateVariables';

export type CustomState = Pick<
  StateModel,
  'connection' | 'power' | 'water' | 'direction'
>;

export const stateVariableIsDiferent = async (
  oldPercent: number,
  newPercent: number
) => {
  const arrayIntervalValids = [-5, -4, -3, -2 - 1, 0, 1, 2, 3, 4, 5];
  const intervalInPercents = oldPercent - newPercent;
  const resultValidate = arrayIntervalValids.includes(intervalInPercents);
  const isValid = resultValidate ? 'Yes' : 'Não';
  console.log(`Inclui no Intervalo de 5: ${isValid} `);
  const dataEquals = oldPercent !== newPercent;

  return dataEquals && !resultValidate;
};

export const isStateDifferent = (
  oldState: CustomState,
  newState: CustomState
): boolean => {
  if (
    oldState.connection !== newState.connection ||
    oldState.power !== newState.power ||
    oldState.water !== newState.water ||
    oldState.direction !== newState.direction
  ) {
    console.log('Mudança de estado ');
    console.log('.....');
    return true;
  }
  return false;
};

type CustomStateVariable = Pick<StateVariableModel, 'angle' | 'percentimeter'>;

type CustomRadioVariable = Pick<RadioVariableModel, 'father' | 'rssi'>;
export const isRadioVariableDifferent = (
  oldRadioVariable: CustomRadioVariable,
  newRadioVariable: CustomRadioVariable
): boolean => {
  if (
    oldRadioVariable.father !== newRadioVariable.father ||
    oldRadioVariable.rssi !== newRadioVariable.rssi
  ) {
    return true;
  }

  return false;
};
