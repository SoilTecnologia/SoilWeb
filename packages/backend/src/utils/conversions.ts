import State from '../models/state';
import StateVariable from '../models/stateVariable';
import Action from '../models/action';

export type StringStatusData =
  `${number}${number}${number}-${number}${number}${number}-${number}${number}${number}-${number}`;

export type StringIntentData =
  `${number}${number}${number}-${number}${number}${number}`;

export type StatusObject = {
  direction: State['direction'];
  water: State['water'];
  power: State['power'];
  percentimeter: StateVariable['percentimeter'];
  angle: StateVariable['angle'];
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
    console.log("timestamp: ", timestamp);
    console.log("final timestamp: ", new Date(Number(timestamp.replace(" ", ""))));
    response.timestamp = new Date(Number(timestamp));

    return response;
  }
  return null;
};

export const objectToActionString = (power: Action['power'], water: Action['water'], direction: Action['direction'], percentimeter: Action['percentimeter']) => {
  let actionString = '';
  if(power) {
    if(direction == "CLOCKWISE") actionString += '3';
    else if(direction == "ANTI_CLOCKWISE") actionString += '4';
    if(water) actionString += '6';
    else actionString += '5';
    actionString += '1';
    actionString += percentimeter.toString().padStart(3, '0');
  } else {
    return '00200';
  }

  return actionString;
}

export const decimalArrayToASCII = (decArray: Array<number>) => {

}
