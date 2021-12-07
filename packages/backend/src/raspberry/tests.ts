import { Readable } from 'stream';
import { FormDataEncoder } from 'form-data-encoder';
import { FormData } from 'formdata-node';
import Axios, { AxiosResponse } from 'axios';
import emitter from '../utils/eventBus';
import Queue from '../utils/queue';
import { statusStringToObject } from '../utils/conversions';

const TIMEOUT = 10000;

type ActionData = {
  action: Action;
  timestamp: Date;
  attempts: number;
};

type IdleData = {
  pivot_id: string;
  radio_id: string;
  attempts: number;
}

let activeQueue: Queue<ActionData> = new Queue<ActionData>(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
let idleQueue: Queue<IdleData> = new Queue<IdleData>(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar

let ready = true;

export const start = async () => {
  loadIntents();

  emitter.on('action', (action) => {
    activeQueue.enqueue({action, timestamp: new Date(), attempts: 0});
  });

  // Seta um intervalo para ficar checando a pool
  // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo
  setInterval(() => {
    if (ready) checkPool();
  }, 2000);
};

const checkPool = async () => {
  ready = false;
  if(!activeQueue.isEmpty()) {
    let current = activeQueue.peek();

    try {
      const data = await sendData(1, );
      if(checkResponse(current.action, data.response)) {
        activeQueue.dequeue();
        ready = true;
      }
    }
  }
}

const loadIntents = async () => {
  const allIntents = await readAllIntentController();

  for (let intent of allIntents) {
    if (intent.power == 'NULL') {
      idlePool.push({ intent, timestamp: new Date(), attempts: 0 });
    } else {
      activePool.push({ intent, timestamp: new Date(), attempts: 0 });
    }
  }
};

type RaspberryResponse = {
  connection: ConnectionState;
  direction: DirectionState;
  water: WaterState;
  power: PowerState;
  percentimeter: number;
  angle: number;
  timestamp: number;
};

const stringToStatus = (responseString: string) => {
  let [_, direction, water, power, percentimeter, angle, timestamp] =
    /(\d{1})-(\d{1})-(\d{1})-(\d{2})-(\d{3})-(\d+)/.exec(responseString) || [
      '',
      '',
      '',
      '',
      0,
      0,
      0
    ];

  let response: RaspberryResponse = {
    connection: 'ONLINE',
    direction: 'NULL',
    water: 'NULL',
    power: 'NULL',
    percentimeter: 0,
    angle: 0,
    timestamp: 0
  };

  if (direction == '3') {
    response.direction = 'CLOCKWISE';
  } else if (direction == '4') {
    response.direction = 'ANTI_CLOCKWISE';
  }

  if (water == '5') {
    response.water = 'DRY';
  } else if (water == '6') {
    response.water = 'WET';
  }

  if (power == '1') {
    response.power = 'ON';
  } else if (direction == '2') {
    response.power = 'OFF';
  }

  response.percentimeter = Number(percentimeter);
  response.angle = Number(angle);
  response.timestamp = Number(timestamp);

  return response;
};

const intentToString = ({ intent }: { intent: Intent }): string => {
  let intentString = '';

  if (intent.direction == 'CLOCKWISE') {
    intentString = intentString.concat('3');
  } else if (intent.direction == 'ANTI_CLOCKWISE') {
    intentString = intentString.concat('4');
  } else {
    return '00000';
  }

  if (intent.water == 'DRY') {
    intentString = intentString.concat('5');
  } else if (intent.water == 'WET') {
    intentString = intentString.concat('6');
  } else {
    return '00000';
  }

  if (intent.power == 'ON') {
    intentString = intentString.concat('1');
  } else if (intent.power == 'OFF') {
    intentString = intentString.concat('2');
  } else {
    return '00000';
  }

  // Adds the percentimeter to the end
  // padStart adds 0's if the percentimeter string < 3, ie: 10 turns into 010
  if (intent.percentimeter == 100) {
    intentString = intentString.concat('99');
  } else {
    intentString = intentString.concat(
      intent.percentimeter.toString().padStart(2, '0')
    );
  }

  return intentString;
};

const processResponse = async (
  pivot_name: Pivot['pivot_name'],
  intent: Intent,
  response: any,
  response_time: number
) => {
  await updateRadioController(
    pivot_name,
    response.payload[3],
    response.payload[0],
    JSON.stringify(response),
    response_time
  );
  await updatePivotController(
    pivot_name,
    'ONLINE',
    undefined,
    'ON',
    'DRY',
    'CLOCKWISE',
    0,
    0
  );
};

// Sends data to radio
// Returns the response
// The payload is a array of Decimal numbers, needs to be converted
type RadioResponse = {
  cmd: number;
  id: number;
  payload: Array<number>;
  status: string;
}

const sendData = async (radio_id: number, data: string) => {
let bodyFormData = new FormData();

  bodyFormData.set('ID', radio_id);
  bodyFormData.set('CMD', '213');
  bodyFormData.set('intencao', data);
  const encoder = new FormDataEncoder(bodyFormData);

  let response = await Axios.post<RadioResponse>('http://192.168.100.100:3031/comands', Readable.from(encoder), {headers: encoder.headers});

  return response;
};


const checkResponse = (action: Action, response: string) => {
  const responseObject = stringToStatus(response);

  if(responseObject) {
    if(responseObject.power == action.power && responseObject.water == action.water && responseObject.direction == action.direction)
      return true;
  }

  return false;
}

// const checkPool = async () => {
//   ready = false;
//   if (fatherCounter < fatherUpdate) {
//     // console.log(
//     //   'Check Pool: ',
//     //   'IDLE: ',
//     //   idlePool.length,
//     //   ' ACTIVE: ',
//     //   activePool.length
//     // );
//     for (let activeIntent of activePool) {
//       console.log(
//         '[ACTIVE]\tSending data to pivot',
//         activeIntent.intent.radio_name
//       );

//       try {
//         const result = await sendData(activeIntent);
//         const { response, response_time } = result;
//         if (
//           response.status == 200 &&
//           response.data.id == activeIntent.intent.radio_name
//         ) {
//           activePool = activePool.filter((value) => value != activeIntent);

//           activeIntent.timestamp = new Date();
//           activeIntent.attempts = 0;
//           idlePool.push(activeIntent);
//           processResponse(
//             activeIntent.intent.radio_name,
//             activeIntent.intent,
//             response.data,
//             response_time
//           );
//         } else {
//           console.log(
//             `[ERROR]\tResposta de outro id: -> ${activeIntent.intent.radio_name} | -> ${response.data.id}`
//           );
//           activeIntent.attempts++;

//           if (activeIntent.attempts >= 5) {
//             await updatePivotController(
//               activeIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             activeIntent.attempts = 0;
//           }
//         }
//       } catch (err) {
//         console.log('[TIMEOUT]\ton', activeIntent.intent.radio_name);
//         activeIntent.attempts++;

//         activePool = activePool.filter((value) => value != activeIntent);

//         activeIntent.timestamp = new Date();
//         idlePool.push(activeIntent);

//         if (activeIntent.attempts >= 5) {
//           await updatePivotController(
//             activeIntent.intent.radio_name,
//             'OFFLINE'
//           );
//           activeIntent.attempts = 0;
//         }
//       }
//     }

//     for (let idleIntent of idlePool) {
//       if (
//         new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
//         8000
//       ) {
//         console.log(
//           '[IDLE]\tSending data to pivot',
//           idleIntent.intent.radio_name
//         );

//         try {
//           const result = await sendData(idleIntent);
//           const { response, response_time } = result;
//           if (
//             response.status == 200 &&
//             response.data.id == idleIntent.intent.radio_name
//           ) {
//             idleIntent.timestamp = new Date();
//             idleIntent.attempts = 0;
//             processResponse(
//               idleIntent.intent.radio_name,
//               idleIntent.intent,
//               response.data,
//               response_time
//             );
//           } else {
//             console.log(
//               `[ERROR]\tResposta de outro id: -> ${idleIntent.intent.radio_name} | -> ${response.data.id}`
//             );
//             idleIntent.attempts++;

//             if (idleIntent.attempts >= 5) {
//               await updatePivotController(
//                 idleIntent.intent.radio_name,
//                 'OFFLINE'
//               );
//               idleIntent.attempts = 0;
//             }
//           }
//         } catch (err) {
//           idleIntent.attempts++;
//           console.log('[TIMEOUT]\ton', idleIntent.intent.radio_name);

//           if (idleIntent.attempts >= 5) {
//             await updatePivotController(
//               idleIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             idleIntent.attempts = 0;
//           }
//         }
//       }
//     }
//   } else {
//     fatherCounter = 0;
//   }
//   fatherCounter++;
//   ready = true;
// };
