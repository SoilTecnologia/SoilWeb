import { prisma } from '.prisma/client';
import express from 'express';
import {
  readOnePivotController,
  readAllPivotController,
  updatePivotController,
  deletePivotController
} from '../controllers/pivot';
import { createRadioController, deleteRadioController } from '../controllers/radio';

const router = express.Router();

// router.post('/create', async (req, res, next) => {
//   const { node_id, pivot_name, lng, lat, start_angle, end_angle, radius } =
//     req.body;

//   try {
//     const newPivot = await createPivotController(
//       node_id,
//       pivot_name,
//       lng,
//       lat,
//       start_angle,
//       end_angle,
//       radius
//     );

//     res.send(newPivot);
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/readOne/:pivot_id', async (req, res, next) => {
  const pivot_id = req.params.pivot_id;

  try {
    const pivot = await readOnePivotController(pivot_id);

    res.send(pivot);
  } catch (err) {
    next(err);
  }
});

router.delete('/:pivot_id', async (req, res, next) => {
  const pivot_id = req.params.pivot_id;

  try {
    await deletePivotController(pivot_id);

    res.send('done');
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

router.put('/update/:pivot_id', async (req, res, next) => {
  const pivot_id = req.params.pivot_id;
  const { pivot_name, power, water, direction, connection, curr_angle, percentimeter } =
    req.body;

  try {
    const updatedPivot = await updatePivotController(
      pivot_name,
      connection,
      undefined,
      power,
      water,
      direction,
      curr_angle,
      percentimeter
    );

    res.send(updatedPivot);
  } catch (err) {
    next(err);
  }
});

router.put('/addRadio/:pivot_id', async (req, res, next) => {
  const { pivot_id } = req.params;
  const { radio_name } = req.body;

  try {
    const newRadio = await createRadioController(pivot_id, radio_name);

    res.send(newRadio);
  } catch (err) {
    next(err);
  }
});

// router.put(
//   '/addRadio/:node_id',
//   async (req, res, next) => {
//     const node_id = req.params.node_id;
//     const {farm_id, pivot_name, lng, lat, start_angle, end_angle, radius} = req.body;

//     try {
//       const newRadio = await createRadioController(radio_name, pivot_id);

//       res.send(newPivot);
//     } catch (err) {
//       next(err);
//     }
//   }
// );

/*
  router.post('/listMap', async (req, res, next) => {
    const farm_id = req.body.farm_id;

    try {
      const pivots = await readPivotsForMapController(farm_id);

      res.send(pivots);
    } catch (err) {
      next(err);
    }
  });
  */

export default router;
