import express from 'express';

const router = express.Router();

  router.post('/:intent', async (req, res, next) => {
    const intent = req.params.intent;


		res.send(`${intent[0]}-${intent[1]}-${intent[2]}-${intent[3]}${intent[4]}-${(Math.random()*360).toFixed(0).toString().padStart(3, "0")}-${Date.now()}`)
  });

  export default router;