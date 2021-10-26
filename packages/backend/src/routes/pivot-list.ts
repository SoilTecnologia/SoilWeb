import express from 'express';
import {
  Pivot,
  Cycle,
  CycleState,
  Radio,
  CycleVariable,
  RadioVariable
} from '@prisma/client';
import { readAllPivotController } from '../controllers/pivot';
import { readCycleController } from '../controllers/cycle';

const router = express.Router();

type PivotListPartialResponse = {
  pivot_id: Pivot['pivot_id'];
  pivot_name: Pivot['pivot_name'];
  power: Cycle['is_running'];
  direction: CycleState['direction'];
  water: CycleState['water'];
  percentimeter: CycleVariable['percentimeter'];
  // voltage: CycleVariable['voltage'];
  pressure: CycleVariable['pressure'];
  rssi: RadioVariable['rssi'];
  rank: RadioVariable['rank'];
};

type PivotListResponse = Array<PivotListPartialResponse>;

router.get('/readAll/:farm_id', async (req, res, next) => {
  const farm_id = req.params.farm_id;
  const response: PivotListResponse = [];

  try {
    const pivots = await readAllPivotController(farm_id);

    if (pivots) {
      for (let pivot of pivots) {
        let partialResponse: PivotListPartialResponse = {
          power: false,
          direction: 'NULL',
          percentimeter: 0,
          pivot_id: '',
          pivot_name: '',
          pressure: 0,
          rank: 0,
          rssi: 0,
          water: 'NULL'
        };

        const { pivot_id, pivot_name } = pivot;

        const cycle = await readCycleController(pivot_id);

        if (cycle) {
					const cycleState = readCycleState();
					const cycleVariable = readCycleVariable();

          const { cycle_id } = cycle;
          partialResponse.power = cycle.is_running;
        }
      }
    }

    res.send(cycle);
  } catch (err) {
    next(err);
  }
});
export default router;
