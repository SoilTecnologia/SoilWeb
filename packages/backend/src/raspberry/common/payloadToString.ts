import { StatusObject } from '../../utils/conversions';

export const statusStringToObject = (status: number[]) => {
  if (status) {
    let [direction, water, power, percentimeter, angle, timestamp] = status;

    let response: StatusObject = {
      power: null,
      direction: null,
      water: null,
      percentimeter: 0,
      angle: 0,
      timestamp: new Date()
    };

    if (direction === 3) {
      response.direction = 'CLOCKWISE';
    } else if (direction === 4) {
      response.direction = 'ANTI_CLOCKWISE';
    }

    if (water === 5) {
      response.water = false;
    } else if (water === 6) {
      response.water = true;
    }

    if (power == 1) {
      response.power = true;
    } else if (power == 2) {
      response.power = false;
    }

    response.percentimeter = percentimeter;
    response.angle = angle;
    response.timestamp = new Date(timestamp);

    return response;
  }
};

// export const payloadToString = (response: number[]) => {
//   let str = '';
//   for (let item of response) {
//     if (typeof item === 'number') {
//       str += item;
//     }
//   }

//   // const conertToString = new TextDecoder().decode(new Uint8Array(response));
//   // const payloadObject = statusStringToObject(
//   //   conertToString.substring(0, conertToString.indexOf('#'))
//   // );

//   return statusStringToObject(str);
// };
