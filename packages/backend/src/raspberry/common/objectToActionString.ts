import { ActionModel } from '../../database/model/Action';

export const objectToActionString = (
  power: ActionModel['power'],
  water: ActionModel['water'],
  direction: ActionModel['direction'],
  percentimeter: ActionModel['percentimeter']
) => {
  let actionString = '';

  if (direction == 'CLOCKWISE') actionString += '3';
  else if (direction == 'ANTI_CLOCKWISE') actionString += '4';
  if (water) actionString += '6';
  else actionString += '5';
  actionString += '1';
  actionString += '-';
  actionString += percentimeter.toString().padStart(3, '0');

  return power ? actionString : '002-000';
};
