import axios from 'axios';
import { updatePivotController } from '../controllers/pivot';
import {
  Pivot,
  PowerState,
  CycleState,
  CycleVariable,
  WaterState
} from '.prisma/client';

const pivot_ids = [
  '440edc61-d899-4bb7-b7f6-da913f83a907',
  '073273f5-4e6a-4d0c-b88d-3274e56a7769',
  'e5922a7d-9443-4f35-8099-2723e30246e4',
  '8adb4583-daf9-4ea4-aeb3-06c66e9530c6'
];

export function start() {
  checkStatus();
}

async function checkStatus() {
  console.log('Calling to check status..');
  const status = await axios.get('http://192.168.100.105:3031/status');
  processData(status.data);

  setTimeout(checkStatus, 500);
}

type StatusData = {
  radios: Array<number>;
  status: Array<string>;
};

type PivotUpdate = {
  pivot_id: Pivot['pivot_id'];
  connection: CycleState['connection'];
  power?: PowerState;
  water?: CycleState['water'];
  direction?: CycleState['direction'];
  curr_angle?: CycleVariable['angle'];
  percentimeter?: CycleVariable['percentimeter'];
};

async function processData(status: StatusData) {
  for (let i = 0; i < status.radios.length; i++) {
    let pivot_id = pivot_ids[i];
    let connection: CycleState['connection'];
    let power: PowerState;
    let water: CycleState['water'];
    let direction: CycleState['direction'];
    let curr_angle: CycleVariable['angle'];
    let percentimeter: CycleVariable['angle'];

    if (status.status[i] == 'NULL') {
      connection = 'OFFLINE';
      await updatePivotController(pivot_id, connection);
    } else {
      let crudeStatus = status.status[i].split('-');
      connection = 'ONLINE';
      direction = crudeStatus[0] == '3' ? 'CLOCKWISE' : 'ANTI_CLOCKWISE';
      water = crudeStatus[1] == '5' ? 'DRY' : 'WET';
      power = crudeStatus[2] == '1' ? 'ON' : 'OFF';
      percentimeter = Number(crudeStatus[3]);
      curr_angle = Number(crudeStatus[4]);

      await updatePivotController(
        pivot_id,
        connection,
        power,
        water,
        direction,
        curr_angle,
        percentimeter
      );
    }
  }
}
