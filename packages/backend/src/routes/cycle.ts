import { prisma } from '.prisma/client';
import express from 'express';
import {
  readAllCycleController,
  readCycleController
} from '../controllers/cycle';

import { Cycle, WaterState, DirectionState, PowerState, ConnectionState } from '@prisma/client';
import db from '../database';

const router = express.Router();

// router.get('/readAll/:pivot_id', async (req, res, next) => {
//   const pivot_id = req.params.pivot_id;

//   try {
//     const cycle = await readAllCycleController(pivot_id);

//     res.send(cycle);
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/read/:pivot_id', async (req, res, next) => {
//   const pivot_id = req.params.pivot_id;

//   try {
//     const cycle = await readCycleController(pivot_id);

//     res.send(cycle);
//   } catch (err) {
//     next(err);
//   }
// });

type CycleStateData = {
  date: Date;
  power: PowerState;
  water: WaterState;
  direction: DirectionState;
  connection: ConnectionState;
};

type PercentData = {
  date: Date;
  percentimeter: number;
};

type CycleData = {
  start_date: Date;
  end_date?: Date;
  is_running: boolean;
  start_state: {
    water: WaterState;
    direction: DirectionState;
  };
  cycle_states: Array<CycleStateData>;
  percent_history: Array<PercentData>;
};

type CycleResponseData = Array<CycleData>;

router.get('/readAll/:pivot_id', async (req, res, next) => {
  const { pivot_id } = req.params;

  let response: CycleResponseData = [];

  try {
    const cycles = await db.cycle.findMany({
      where: { pivot_id },
      orderBy: { timestamp: 'desc' },
      select: {
        is_running: true,
        cycle_states: { orderBy: { timestamp: 'asc' } },
        cycle_variables: { orderBy: { timestamp: 'asc' } }
      }
    });

    for (let cycle of cycles) {
      let newCycle: CycleData = {
        start_date: cycle.cycle_states[0].timestamp,
        is_running: cycle.is_running,
        start_state: { direction: 'NULL', water: 'NULL' },
        cycle_states: [],
        percent_history: []
      };

      newCycle.start_state.water = cycle.cycle_states[0].water;
      newCycle.start_state.direction = cycle.cycle_states[0].direction;

      for (let cycleState of cycle.cycle_states) {
        newCycle.cycle_states.push({
          date: cycleState.timestamp,
          power: 'ON',
          water: cycleState.water,
          direction: cycleState.direction,
          connection: cycleState.connection
        });
      }

      for (let cycleVariable of cycle.cycle_variables) {
        newCycle.percent_history.push({
          percentimeter: cycleVariable.percentimeter,
          date: cycleVariable.timestamp
        });
      }

      if (!cycle.is_running) {
        newCycle.end_date =
          cycle.cycle_states[cycle.cycle_states.length - 1].timestamp;
        newCycle.cycle_states.push({
          date: cycle.cycle_states[cycle.cycle_states.length - 1].timestamp,
          power: 'OFF',
          water: cycle.cycle_states[cycle.cycle_states.length - 1].water,
          direction: cycle.cycle_states[cycle.cycle_states.length - 1].direction,
          connection: cycle.cycle_states[cycle.cycle_states.length - 1].connection
        });
      }

      response.push(newCycle);
    }

    res.send(response);
  } catch (err) {
    next(err);
  }
});

export default router;
