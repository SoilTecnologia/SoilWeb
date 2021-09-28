import express from 'express';
import authMiddleware from '../middlewares/auth';
import { IUserAuthInfoRequest, authHandler } from '../types/express';
import { createNodeController } from '../controllers/node';

const router = express.Router();

router.post('/create',authMiddleware(["USER", 'SUDO']), async (req, res, next) => {
  const { node_id, farm_id, isGPRS } = req.body;

  try {
    const newNode = await createNodeController(
      node_id,
      farm_id,
      isGPRS
    );

    res.send(newNode);
  } catch (err) {
    next(err);
  }
});


export default router;