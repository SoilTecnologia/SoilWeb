import express from 'express';
import { updatePivotController } from '../controllers/pivot';

const router = express.Router();

router.put('/update/:pivot_id', async (req, res, next) => {
  const pivot_id = req.params.pivot_id;
  const {
    power,
    water,
    direction,
    connection,
    angle,
    percentimeter,
    timestamp
  } = req.body;

  try {
    const updatedPivot = await updatePivotController(
      pivot_id,
      connection,
      power,
      water,
      direction,
      percentimeter,
      angle,
      timestamp
    );

    res.send(updatedPivot);
  } catch (err) {
    next(err);
  }
});

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

// router.get('/readOne/:pivot_id', async (req, res, next) => {
//   const pivot_id = req.params.pivot_id;

//   try {
//     const pivot = await readOnePivotController(pivot_id);

//     res.send(pivot);
//   } catch (err) {
//     next(err);
//   }
// });

// router.delete('/:pivot_id', async (req, res, next) => {
//   const pivot_id = req.params.pivot_id;

//   try {
//     await deletePivotController(pivot_id);

//     res.send('done');
//   } catch (err) {
//     next(err);
//   }
// });

// router.get('/readAll/:farm_id', async (req, res, next) => {
//   const farm_id = req.params.farm_id;

//   try {
//     const pivot = await readAllPivotController(farm_id);

//     res.send(pivot);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
