import express from 'express';
import { createFarmController, listFarmController } from '../controllers/farm';

const router = express.Router();

router.post('/create', async (req, res, next) => {
  const user = req.user;
  const { farm_name, city, lng, lat, gateway } = req.body;

  try {
    const newFarm = await createFarmController(farm_name, city, lng, lat, gateway);

		res.send(newFarm)
  } catch (err) {
    next(err);
  }
});

router.get('/list', async (req, res, next) => {
  const user = req.user;

  try {
    const farms = await listFarmController(user.user_id);

    return res.send(farms);
  } catch (err) {
    next(err);
  }
});

export default router;