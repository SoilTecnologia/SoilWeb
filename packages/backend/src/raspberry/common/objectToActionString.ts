import { ActionModel } from '../../database/model/Action';
import { StateVariableModel } from '../../database/model/StateVariables';

const handleResultPercentToString = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  } else return num.toString();
};

const responseAngle = (angle: number) => {
  if (angle < 0) return 0;
  else if (angle > 360) return 360;
  else return angle;
};

export const objectToActionString = (
  power: ActionModel['power'],
  water: ActionModel['water'],
  direction: ActionModel['direction'],
  percentimeter: ActionModel['percentimeter'],
  newAngle?: StateVariableModel['angle']
) => {
  let actionString = '';
  const percent = handleResultPercentToString(percentimeter);
  if (direction == 'CLOCKWISE') actionString += '3';
  else if (direction == 'ANTI_CLOCKWISE') actionString += '4';
  if (water) actionString += '6';
  else actionString += '5';
  actionString += '1';
  actionString += '-';
  actionString += percent.toString().padStart(3,"0")
  if (newAngle) {
    const angle = responseAngle(newAngle);
    actionString += '-';
    actionString += angle;
  }

  return power ? actionString : '002-000';
};
