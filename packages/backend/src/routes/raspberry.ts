import { PowerState, CycleState, CycleVariable } from '@prisma/client';
import { timeStamp } from 'console';
import express from 'express';
import { readRadioController } from '../controllers/radio';
import { updatePivotController } from '../controllers/pivot';

const router = express.Router();

type UpdateData = {
  power: PowerState;
  water: CycleState['water'];
  direction: CycleState['direction'];
  connection: CycleState['connection'];
  curr_angle: CycleVariable['angle'];
  percentimeter: CycleVariable['percentimeter'];
};

router.post('/update/:radio_name/:status', async (req, res, next) => {
  const { radio_name, status } = req.params;
  const radio = await readRadioController(radio_name);
  let update: UpdateData = {
    power: 'NULL',
    water: 'NULL',
    direction: 'NULL',
    connection: 'OFFLINE',
    curr_angle: 0,
    percentimeter: 0
  };

  if (radio != null) {
    if (status != 'offline') {
			update.connection = "ONLINE";
      if (status[0] == '3') update.direction = 'CLOCKWISE';
      else if (status[0] == '4') update.direction = 'ANTI_CLOCKWISE';

      if (status[1] == '5') update.water = 'DRY';
      else if (status[1] == '6') update.water = 'WET';

      if (status[2] == '1') update.power = 'ON';
      else if (status[2] == '2') update.power = 'OFF';

      const percentString = status.slice(3, 5);
      const angleString = status.slice(5, 8);
      // const timestampString = status.slice(8);

      update.percentimeter = Number(percentString);
      update.curr_angle = Number(angleString);
      // update.timestamp = Number(timestampString);
    }

    const pivot_id = radio.pivot_id;

    try {
      const newUpdate = await updatePivotController(
        pivot_id,
        update.connection,
        update.power,
        update.water,
        update.direction,
        update.curr_angle,
        update.percentimeter
      );

      res.json(newUpdate);
    } catch (err) {
      next(err);
    }
  } else {
    res.json({ message: `Pivot with radio ${radio_name} not found` });
  }
});

export default router;
