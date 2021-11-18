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

    emitter.emit("intent", newIntent);
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
  pivot_start_angle: number;
  pivot_end_angle: number;
  cycle_start_angle: number;
  cycle_curr_angle: number;
}

router.get('/:pivot_id', async(req, res, next) => {
  const { pivot_id } = req.params;
  try {
    let response: IntentPageResponse;

    const pivot = await DBError.

    return res.send(response);
  } catch (err) {
    next(err);
  }
})

export default router;
