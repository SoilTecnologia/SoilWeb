import { StatusObject } from '../../utils/conversions';

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

export const payloadToString = (response: number[]) => {
  const conertToString = new TextDecoder().decode(new Uint8Array(response));
  const payloadObject = statusStringToObject(
    conertToString.substring(0, conertToString.indexOf('#'))
  );

  return payloadObject;
};
