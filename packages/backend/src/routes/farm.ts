import express from 'express';
import verifyUser from '../middlewares/user';
import {
  createFarmController,
  readAllFarmController
} from '../controllers/farm';

const router = express.Router();

router.post('/create', async (req, res, next) => {
  const { user_ids, farm_name, city, lng, lat, gateway } = req.body;

  try {
    const newFarm = await createFarmController(
      farm_name,
      city,
      lng,
      lat,
      gateway,
      user_ids
    );

    res.send(newFarm);
  } catch (err) {
    next(err);
  }
});

router.post('/update');

router.get('/readAll', verifyUser, async (req: Request & {user: }, res, next) => {
  const user = req.user;

  try {
    const farms = await readAllFarmController(user.user_id);

    return res.send(farms);
  } catch (err) {
    next(err);
  }
});

export default router;
