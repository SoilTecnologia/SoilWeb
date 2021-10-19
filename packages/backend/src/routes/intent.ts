import express from 'express';
import { updateIntentController } from '../controllers/intent';
import { start } from '../raspberry/index';

const router = express.Router();

router.put('/:pivot_id', async (req, res, next) => {
  const { pivot_id } = req.params;
  const {
    power,
    water,
    direction,
    percentimenter,
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
      percentimenter,
      start_angle,
      end_angle,
      date_on,
      date_off
    );

    return res.send(newIntent);
  } catch (err) {
    next(err);
  }
});

export default router;
