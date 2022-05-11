import { RadioVariableModel } from '../database/model/RadioVariable';
import { StateModel } from '../database/model/State';
import { StateVariableModel } from '../database/model/StateVariables';
import emitter from './eventBus';

export type CustomState = Pick<
  StateModel,
  'connection' | 'power' | 'water' | 'direction'
>;
type CustomStateVariable = Pick<StateVariableModel, 'angle' | 'percentimeter'>;

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

const isPercentDiferent = (oldPercent: number, newPercent: number) => {
  const arrayPercent = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const subtractPercent = oldPercent - newPercent;
  const percentAltered =
    oldPercent !== newPercent &&
    arrayPercent.some((num) => num === subtractPercent);

  return percentAltered;
};

export const isStateVariableDifferent = (
  oldStateVariable: CustomStateVariable,
  newStateVariable: CustomStateVariable,
  pivot_id: string
): boolean => {
  if (oldStateVariable.angle !== newStateVariable.angle) {
    emitter.emit(`angle-changed-${pivot_id}`, {
      oldAngle: oldStateVariable.angle,
      newAlgle: newStateVariable.angle,
      pivot_id
    });

    console.log(
      `Estado de angulo alterado: antigo: ${oldStateVariable.angle}, novo: ${newStateVariable.angle}`
    );
  }

  if (oldStateVariable.percentimeter !== newStateVariable.percentimeter) {
    console.log(`Estado de percentimetro alterado:
    Antigo Percentimetro: ${oldStateVariable.percentimeter}
    Novo Percentimetro: ${newStateVariable.percentimeter}`);
  }

  const percentAltered = isPercentDiferent(
    oldStateVariable.percentimeter!!,
    newStateVariable.percentimeter!!
  );

  if (
    oldStateVariable.angle! !== newStateVariable.angle! - 5 ||
    percentAltered
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
