import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import {
  createFarmController,
  readAllFarmController,
} from '../controllers/farm';
import {
  addUserToFarmController
} from '../controllers/farm_user'

const router = express.Router();

router.post('/create',authMiddleware(["SUDO"]), async (req, res, next) => {
  const { user_ids, farm_name, city, lng, lat, gateway } = req.body;

  try {
    const newFarm = await createFarmController(
      farm_name,
      city,
      lng,
      lat,
      gateway,
    );

    res.send(newFarm);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/readAll',
  authMiddleware(['USER']),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const user = req.user;

      try {
        const farms = await readAllFarmController(user.user_id);

        return res.send(farms);
      } catch (err) {
        next(err);
      }
    }
  )
);

router.put(
  '/addUser/:target_farm_id',
  authMiddleware(['USER', 'SUDO']), 
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const user = req.user;
      const { target_farm_id } = req.params;
      const { target_user_id, farm_user_type } = req.body;

      try {
        const farms = await addUserToFarmController(
          user.user_id,
          target_user_id,
          target_farm_id,
          farm_user_type
        );

        return res.send(farms);
      } catch (err) {
        next(err);
      }
    }
  )
);

// router.put(
//   '/addAdmin/:target_farm_id',
//   authMiddleware(['SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;
//       const { target_farm_id } = req.params;
//       const { target_user_id } = req.body;

//       try {
//         const farms = await addUserToFarmController(
//           user.user_id,
//           target_user_id,
//           target_farm_id
//         );

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

export default router;
