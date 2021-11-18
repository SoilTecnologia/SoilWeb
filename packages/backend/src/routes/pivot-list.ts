import express from 'express';
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
import { readAllPivotController } from '../controllers/pivot';
import { readCycleController } from '../controllers/cycle';
import db from '../database';

const router = express.Router();

type PartialPivot = {
  pivot_id: Pivot['pivot_id'];
  pivot_name: Pivot['pivot_name'];
  power: PowerState;
  water?: CycleState['water'];
  direction?: CycleState['direction'];
  percentimeter?: CycleVariable['percentimeter'];
  rssi?: RadioVariable['rssi'];
  connection: CycleState['connection'];
  timestamp?: CycleState['timestamp'];
};

type PivotListResponse = {
  farm_name: Farm['farm_name'];
  pivots: Array<PartialPivot>;
};

router.get('/readAll/:farm_id', async (req, res, next) => {
  const farm_id = req.params.farm_id;
  let response: PivotListResponse = { farm_name: '', pivots: [] };

  try {
    const farm = await db.farm.findFirst({
      where: { farm_id },
      select: { farm_name: true, nodes: true }
    });
    if (farm) {
      response.farm_name = farm.farm_name;

      for (let node of farm.nodes) {
        const pivots = await db.pivot.findMany({
          where: { node_id: node.node_id }
        });

        for (let pivot of pivots) {
          let partialPivot: PartialPivot = {} as PartialPivot;
          partialPivot.pivot_name = pivot.pivot_name;
          partialPivot.pivot_id = pivot.pivot_id;

          const cycle = await db.cycle.findFirst({
            where: { pivot_id: pivot.pivot_id },
            orderBy: { timestamp: 'desc' }
          });

          if (cycle && cycle.is_running) {
            const cycleState = await db.cycleState.findFirst({
              where: { cycle_id: cycle.cycle_id },
              orderBy: { timestamp: 'desc' }
            });

            const cycleVariable = await db.cycleVariable.findFirst({
              where: { cycle_id: cycle.cycle_id },
              orderBy: { timestamp: 'desc' }
            });

            // const RadioVariable = await db.radioVariable.findFirst({
            //   where: { radio_id: pivot.radio.radio_id },
            //   orderBy: { timestamp: 'desc' }
            // });

            if (cycleState && cycleVariable) {
              if (cycleState.connection == 'ONLINE') {
                partialPivot.power = 'ON';
                partialPivot.water = cycleState.water;
                partialPivot.direction = cycleState.direction;
                partialPivot.percentimeter = cycleVariable.percentimeter;
                partialPivot.rssi = 0;
                partialPivot.timestamp = cycleState.timestamp;
                partialPivot.connection = cycleState.connection;
              } else {
                partialPivot.connection = 'OFFLINE';
              }
            }
          } else {
            partialPivot.power = 'OFF';
          }
        }
      }
    }

    res.send(response);
  } catch (err) {
    next(err);
  }
});
export default router;
