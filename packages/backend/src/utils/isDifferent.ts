import State from '../models/state';
import StateVariable from '../models/stateVariable';
import RadioVariable from '../models/radioVariable';

type CustomState = Pick<State, 'connection' | 'power' | 'water' |'direction'>; 
export const isStateDifferent = (oldState: CustomState, newState: CustomState): boolean => {
  if (
    oldState.connection != newState.connection ||
    oldState.power != newState.power ||
    oldState.water != newState.water ||
    oldState.direction != newState.direction
  ) {
    return true;
  }
  return false;
};

type CustomStateVariable = Pick<StateVariable, 'angle' | 'percentimeter'>;
export const isStateVariableDifferent = (
  oldStateVariable: CustomStateVariable,
  newStateVariable: CustomStateVariable
): boolean => {
  if (
    oldStateVariable.angle != newStateVariable.angle ||
    oldStateVariable.percentimeter != newStateVariable.percentimeter
  ) {
    return true;
  }

	return false;
};

type CustomRadioVariable = Pick<RadioVariable, 'father' | 'rssi'>;
export const isRadioVariableDifferent = (
  oldRadioVariable: CustomRadioVariable,
  newRadioVariable: CustomRadioVariable
): boolean => {
  if (
    oldRadioVariable.father != newRadioVariable.father ||
    oldRadioVariable.rssi != newRadioVariable.rssi
  ) {
    return true;
  }

	return false;
};