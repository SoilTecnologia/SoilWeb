import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import {
  createFarmController,
  readAllFarmController
} from '../controllers/farms';
import { createNodeController } from '../controllers/nodes';

const router = express.Router();

router.post(
  '/create',
  authMiddleware(['SUDO', 'USER']),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const user = req.user;
      const { farm_id, farm_name, farm_city, farm_lng, farm_lat } = req.body;

      try {
        const newFarm = await createFarmController(
          farm_id,
          user.user_id,
          farm_name,
          farm_city,
          farm_lng,
          farm_lat
        );

        res.send(newFarm);
      } catch (err) {
        next(err);
      }
    }
  )
);

router.put(
  '/addNode/:farm_id',
  authMiddleware(['USER', 'SUDO']),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { farm_id } = req.params;
      const { node_name, gateway, is_gprs } = req.body;

      try {
        const newNode = await createNodeController(
          farm_id,
          node_name,
          is_gprs,
          gateway
        );

        res.send(newNode);
      } catch (err) {
        next(err);
      }
    }
  )
);

router.get(
  '/readAll',
  authMiddleware(['USER', 'SUDO']),
  authHandler(
    async (
      req: IUserAuthInfoRequest,
      res: express.Response,
      next: express.NextFunction
    ) => {
      const { user_id } = req.user;

      try {
        const allFarmsFromUser = await readAllFarmController(user_id);

        res.send(allFarmsFromUser);
      } catch (err) {
        next(err);
      }
    }
  )
);

// router.get(
//   '/readAll',
//   authMiddleware(['SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;

//       try {
//         const farms = await readAllFarmController(user.user_id);

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

// router.put(
//   '/addUser/:target_farm_id',
//   authMiddleware(['USER', 'SUDO']),
//   authHandler(
//     async (
//       req: IUserAuthInfoRequest,
//       res: express.Response,
//       next: express.NextFunction
//     ) => {
//       const user = req.user;
//       const { target_farm_id } = req.params;
//       const { target_user_id, farm_user_type } = req.body;

//       try {
//         const farms = await addUserToFarmController(
//           user.user_id,
//           target_user_id,
//           target_farm_id,
//           farm_user_type
//         );

//         return res.send(farms);
//       } catch (err) {
//         next(err);
//       }
//     }
//   )
// );

// router.delete('/:farm_id', authMiddleware(['SUDO']), async (req, res, next) => {
//   const farm_id = req.params.farm_id;

//   try {
//     const deletedFarm = await deleteFarmController(farm_id);

//     res.send(deletedFarm);
//   } catch (err) {
//     next(err);
//   }
// });

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
