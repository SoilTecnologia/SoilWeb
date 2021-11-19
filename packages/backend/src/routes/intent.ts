import express from 'express';
import { updateIntentController } from '../controllers/intent';
import { start } from '../raspberry/index';
import emitter from '../utils/eventBus';

import {
  Pivot,
  Cycle,
  CycleState,
  Radio,
  CycleVariable,
  RadioVariable,
  PowerState,
  Farm
} from '@prisma/client';
import db from '../database';

const router = express.Router();

router.put('/:pivot_id', async (req, res, next) => {
  const { pivot_id } = req.params;
  const {
    power,
    water,
    direction,
    percentimeter,
    start_angle,
    end_angle,
    date_on,
    date_off
  } = req.body;

  try {
    const newIntent = await updateIntentController(
      pivot_id,
      power,
      water,
      direction,
      percentimeter
    );

    emitter.emit('intent', newIntent);
    return res.send(newIntent);
  } catch (err) {
    next(err);
  }
});

type IntentPageResponse = {
  pivot_name: string;
  power: PowerState;
  water?: CycleState['water'];
  direction?: CycleState['direction'];
  percentimeter?: CycleVariable['percentimeter'];
  rssi: RadioVariable['rssi'];
  connection: CycleState['connection'];
  timestamp: CycleState['timestamp'];
  lng: number;
  lat: number;
  pivot_start_angle: number;
  pivot_end_angle: number;
  cycle_start_angle: number;
  cycle_curr_angle: number;
};

router.get('/:pivot_id', async (req, res, next) => {
  const { pivot_id } = req.params;
  try {
    let response: IntentPageResponse = {} as IntentPageResponse;

    const pivot = await db.pivot.findFirst({ where: { pivot_id } });
    if (pivot) {
      response.pivot_name = pivot.pivot_name;
      response.pivot_start_angle = pivot.start_angle;
      response.pivot_end_angle = pivot.end_angle;
      response.lng = pivot.lng;
      response.lat = pivot.lat;

      const cycle = await db.cycle.findFirst({ where: { pivot_id } });
      if (cycle && cycle.is_running) {
          // Pega o primeiro estado daquele ciclo para ver onde ele começoiu
          const startCycleState = await db.cycleState.findFirst({
            where: { cycle_id: cycle.cycle_id },
            orderBy: { timestamp: 'asc' }
          });

          const currentCycleState = await db.cycleState.findFirst({
            where: { cycle_id: cycle.cycle_id },
            orderBy: { timestamp: 'desc' }
          });

          if (startCycleState && currentCycleState) {
            response.cycle_start_angle = startCycleState.start_angle;
            response.cycle_curr_angle = currentCycleState.end_angle;
            response.connection = currentCycleState.connection;

            if (currentCycleState.connection == 'ONLINE') {
              response.power = 'ON';
              response.water = currentCycleState.water;
              response.direction = currentCycleState.direction;
              response.timestamp = currentCycleState.timestamp;

              const cycleVariable = await db.cycleVariable.findFirst({
                where: { cycle_id: cycle.cycle_id },
                orderBy: { timestamp: 'desc' }
              });

              if (cycleVariable) {
                response.percentimeter = cycleVariable?.percentimeter;
                response.rssi = 0; //TODO: MUDAR PARA O VALOR CORRETO
              }
            }
          }
        } else {
          response.power = 'OFF';
        }
    }

    return res.send(response);
  } catch (err) {
    next(err);
  }
});

export default router;
