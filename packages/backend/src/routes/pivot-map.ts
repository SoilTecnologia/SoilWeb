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
import db from '../database';

const router = express.Router();

type PartialPivot = {
  pivot_id: Pivot['pivot_id'];
  power: PowerState;
  water?: CycleState['water'];
  direction?: CycleState['direction'];
  connection: CycleState['connection'];
  timestamp?: CycleState['timestamp'];
  lng: Pivot['lng'];
  lat: Pivot['lat'];
  pivot_start_angle: number;
  pivot_end_angle: number;
  cycle_start_angle: number;
  cycle_end_angle: number;
};

type PivotMapResponse = {
  farm_name: Farm['farm_name'];
  lng: Farm['lng'];
  lat: Farm['lat'];
  pivots: Array<PartialPivot>;
};

router.get('/readAll/:farm_id', async (req, res, next) => {
  const farm_id = req.params.farm_id;
  let response: PivotMapResponse = {
    farm_name: '',
    lng: -21,
    lat: -46,
    pivots: []
  };

  try {
    const farm = await db.farm.findFirst({
      where: { farm_id },
      select: { farm_name: true, lat: true, lng: true, nodes: true }
    });
    if (farm) {
      response.farm_name = farm.farm_name;
      response.lat = farm.lat;
      response.lng = farm.lng;

      for (let node of farm.nodes) {
        const pivots = await db.pivot.findMany({
          where: { node_id: node.node_id }
        });

        for (let pivot of pivots) {
          let partialPivot: PartialPivot = {} as PartialPivot;
          partialPivot.pivot_id = pivot.pivot_id;
          partialPivot.lng = pivot.lng;
          partialPivot.lat = pivot.lat;
          partialPivot.pivot_start_angle = pivot.start_angle;
          partialPivot.pivot_end_angle = pivot.end_angle;

          const cycle = await db.cycle.findFirst({
            where: { pivot_id: pivot.pivot_id },
            orderBy: { timestamp: 'desc' }
          });

          if (cycle && cycle.is_running) {
            const startCycleState = await db.cycleState.findFirst({
              where: { cycle_id: cycle.cycle_id },
              orderBy: { timestamp: 'asc' }
            });

            const currentCycleState = await db.cycleState.findFirst({
              where: { cycle_id: cycle.cycle_id },
              orderBy: { timestamp: 'desc' }
            });

            // const RadioVariable = await db.radioVariable.findFirst({
            //   where: { radio_id: pivot.radio.radio_id },
            //   orderBy: { timestamp: 'desc' }
            // });

            if (startCycleState && currentCycleState) {
              partialPivot.connection = currentCycleState.connection;
              partialPivot.cycle_start_angle = startCycleState.start_angle;
              partialPivot.cycle_end_angle = currentCycleState.end_angle;

              if (currentCycleState.connection == 'ONLINE') {
                partialPivot.power = 'ON';
                partialPivot.water = currentCycleState.water;
                partialPivot.direction = currentCycleState.direction;
              } else {
                partialPivot.connection = 'OFFLINE';
              }
            }
          } else {
            partialPivot.power = 'OFF';
          }
          response.pivots.push(partialPivot);
        }
      }
    }

    res.send(response);
  } catch (err) {
    next(err);
  }
});
export default router;
