import { prisma } from '.prisma/client';
import express from 'express';
import { readAllCycleController } from '../controllers/cycle';

const router = express.Router();

  router.get('/readAll/:pivot_id', async (req, res, next) => {
    const pivot_id = req.params.pivot_id;

    try {
      const cycle = await readAllCycleController(pivot_id);

      res.send(cycle);
    } catch (err) {
      next(err);
    }
  });
  export default router;