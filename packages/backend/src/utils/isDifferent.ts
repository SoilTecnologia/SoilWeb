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
  const oldAngle = oldStateVariable.angle;
  const newAngle = newStateVariable.angle;

  console.log(
    `Alteração de angulo em ${pivot_id}, antes: ${oldAngle}, novo: ${newAngle}`
  );
  console.log('...');
  if (oldStateVariable.angle !== newStateVariable.angle) {
    emitter.emit(`angle-changed-${pivot_id}`, {
      oldAngle,
      newAngle,
      pivot_id
    });
  }

  if (oldStateVariable.percentimeter !== newStateVariable.percentimeter) {
    const oldPercent = oldStateVariable.percentimeter;
    const newPercent = oldStateVariable.angle;
    console.log(
      `Estado de percentimetro alterado: antigo, ${oldPercent}, novo: ${newPercent}`
    );
    console.log('...');
  }

  const percentAltered = isPercentDiferent(
    oldStateVariable.percentimeter!!,
    newStateVariable.percentimeter!!
  );

  return (
    oldStateVariable.angle! !== newStateVariable.angle! - 5 || percentAltered
  );
};

type CustomRadioVariable = Pick<RadioVariableModel, 'father' | 'rssi'>;
export const isRadioVariableDifferent = (
  oldRadioVariable: CustomRadioVariable,
  newRadioVariable: CustomRadioVariable
): boolean => {
  return (
    oldRadioVariable.father !== newRadioVariable.father ||
    oldRadioVariable.rssi !== newRadioVariable.rssi
  );
};
