import { RadioVariableModel } from '../database/model/RadioVariable';
import { StateModel } from '../database/model/State';
import { StateVariableModel } from '../database/model/StateVariables';

export type CustomState = Pick<
  StateModel,
  'connection' | 'power' | 'water' | 'direction'
>;
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
export const isStateVariableDifferent = (
  oldStateVariable: CustomStateVariable,
  newStateVariable: CustomStateVariable
): boolean => {
  if (
    oldStateVariable.angle! <= newStateVariable.angle! - 5 ||
    oldStateVariable.angle! >= newStateVariable.angle! + 5 ||
    oldStateVariable.percentimeter! <= newStateVariable.percentimeter! - 5 ||
    oldStateVariable.percentimeter! >= newStateVariable.percentimeter! + 5
  ) {
    console.log('atualização de variavel');
    console.log(oldStateVariable);
    console.log(newStateVariable);
    return true;
  }

  return false;
};

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
