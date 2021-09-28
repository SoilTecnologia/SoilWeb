import { prisma } from '.prisma/client';
import express from 'express';
import {createPivotController, readOnePivotController, readAllPivotController, updatePivotController, readPivotsForMapController} from '../controllers/pivot';

const router = express.Router();

  router.post('/create', async (req, res, next) => {
    const { node_id, pivot_name, lng, lat, start_angle, end_angle, radius } =
      req.body;

    try {
      const newPivot = await createPivotController(
        node_id,
        pivot_name,
        lng,
        lat,
        start_angle,
        end_angle,
        radius
      );

      res.send(newPivot);
    } catch (err) {
      next(err);
    }
  });

  router.get('/readOne/:pivot_id', async (req, res, next) => {
    const pivot_id = req.params.pivot_id;

    try {
      const pivot = await readOnePivotController(pivot_id);

      res.send(pivot);
    } catch (err) {
      next(err);
    }
  });

  router.get('/readAll/:farm_id', async (req, res, next) => {
    const farm_id = req.params.farm_id;

    try {
      const pivot = await readAllPivotController(farm_id);

      res.send(pivot);
    } catch (err) {
      next(err);
    }
  });

  router.put('/update', async (req, res, next) => {
    const {
      pivot_id,
      farm_id,
      pivot_name,
      lng,
      lat,
      start_angle,
      end_angle,
      radius
    } = req.body;

    try {
      const updatedPivot = await updatePivotController(
        pivot_id,
        farm_id,
        pivot_name,
        lng,
        lat,
        start_angle,
        end_angle,
        radius
      );

      res.send(updatedPivot);
    } catch (err) {
      next(err);
    }
  });

  router.post('/listMap', async (req, res, next) => {
    const farm_id = req.body.farm_id;

    try {
      const pivots = await readPivotsForMapController(farm_id);

      res.send(pivots);
    } catch (err) {
      next(err);
    }
  });

  export default router;