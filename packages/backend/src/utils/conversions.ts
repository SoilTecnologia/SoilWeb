import State from '../models/state';
import StateVariable from '../models/stateVariable';

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

    console.log(status)
  let response: StatusObject = {
    power: undefined,
    direction: undefined,
    water: undefined,
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
    response.timestamp = new Date(timestamp);

    return response;
  }
  return null;
};

export const decimalArrayToASCII = (decArray: Array<number>) => {

}