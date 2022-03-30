import { ActionModel } from '../database/model/Action';
import { StateModel } from '../database/model/State';
import { StateVariableModel } from '../database/model/StateVariables';

export type StringStatusData =
  `${number}${number}${number}-${number}${number}${number}-${number}${number}${number}-${number}`;

export type StringIntentData =
  `${number}${number}${number}-${number}${number}${number}`;

export type StatusObject = {
  direction: StateModel['direction'];
  water: StateModel['water'];
  power: StateModel['power'];
  percentimeter: StateVariableModel['percentimeter'];
  angle: StateVariableModel['angle'];
  timestamp: Date;
};

export const statusStringToObject = (status: string) => {
  let [match, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})-(\d{1})-(\d{1})-(\d+)-(\d+)-(\d+)/.exec(`${status}`) || [];

  let response: StatusObject = {
    power: null,
    direction: null,
    water: null,
    percentimeter: 0,
    angle: 0,
    timestamp: new Date()
  };

  if (direction === '3') {
    response.direction = 'CLOCKWISE';
  } else if (direction === '4') {
    response.direction = 'ANTI_CLOCKWISE';
  }

  if (water === '5') {
    response.water = false;
  } else if (water === '6') {
    response.water = true;
  }

  if (power == '1') {
    response.power = true;
  } else if (power == '2') {
    response.power = false;
  }

  response.percentimeter = Number(percentimeter);
  response.angle = Number(angle);
  response.timestamp = new Date(Number(timestamp));

  const data = { response, match };

  return data;
};

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

export const statusPayloadStringToObject = (payload: string) => {
  let [match, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})(\d{1})(\d{1})-(\d+)-(\d+)-(\d+)/.exec(`${payload}`) || [];

  let response: StatusObject = {
    power: null,
    direction: null,
    water: null,
    percentimeter: 0,
    angle: 0,
    timestamp: new Date()
  };

  if (match) {
    if (direction == '3') {
      response.direction = 'CLOCKWISE';
    } else if (direction == '4') {
      response.direction = 'ANTI_CLOCKWISE';
    }

    if (water == '5') {
      response.water = false;
    } else if (water == '6') {
      response.water = true;
    }

    if (power == '1') {
      response.power = true;
    } else if (power == '2') {
      response.power = false;
    }

    response.percentimeter = Number(percentimeter);
    response.angle = Number(angle);
    response.timestamp = new Date(Number(timestamp) * 1000);

    return response;
  }
  return null;
};

export const objectToActionPayloadString = (
  power: ActionModel['power'],
  water: ActionModel['water'],
  direction: ActionModel['direction'],
  percentimeter: ActionModel['percentimeter']
) => {
  let actionString = '';
  if (power) {
    if (direction == 'CLOCKWISE') actionString += '3';
    else if (direction == 'ANTI_CLOCKWISE') actionString += '4';
    if (water) actionString += '6';
    else actionString += '5';
    actionString += '1';
    actionString += percentimeter.toString().padStart(3, '0');
  } else {
    return '002-000';
  }

  return actionString;
};

export const decimalArrayToASCII = (decArray: Array<number>) => {};
