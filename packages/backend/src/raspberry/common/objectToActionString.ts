import { ActionModel } from '../../database/model/Action';

const handleResultPercentToString = (num: number) => {
  if (num < 10) {
    console.log(`Número recebido: ${num}`);
    return `0${num}`;
  } else return num.toString();
};

export const objectToActionString = (
  power: ActionModel['power'],
  water: ActionModel['water'],
  direction: ActionModel['direction'],
  percentimeter: ActionModel['percentimeter']
) => {
  let actionString = '';
  const percent = handleResultPercentToString(percentimeter);
  console.log(`New number ${percent}`);
  if (direction == 'CLOCKWISE') actionString += '3';
  else if (direction == 'ANTI_CLOCKWISE') actionString += '4';
  if (water) actionString += '6';
  else actionString += '5';
  actionString += '1';
  actionString += '-';
  actionString += percent;

  return power ? actionString : '002-000';
};
