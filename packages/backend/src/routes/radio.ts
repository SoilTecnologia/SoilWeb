import express from "express";
import { deleteRadioController } from "../controllers/radio";

const router = express.Router();

router.delete('/:radio_id', async (req, res, next) => {
  const radio_id = req.params.radio_id;

  try {
    const deletedRadio = await deleteRadioController(radio_id);

    res.send(deletedRadio);
  } catch (err) {
    next(err);
  }
});

export default router;