import { prisma } from '.prisma/client';
import express from 'express';
import { readAllCycleController, readCycleController } from '../controllers/cycle';

import {
  Cycle,
  WaterState,
  DirectionState,
  PowerState
} from '@prisma/client';
import db from '../database';

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

  router.get('/read/:pivot_id', async (req, res, next) => {
    const pivot_id = req.params.pivot_id;

    try {
      const cycle = await readCycleController(pivot_id);

      res.send(cycle);
    } catch (err) {
      next(err);
    }
  });

  type CycleStateData = {
    date: Date;
    power: PowerState;
    water: WaterState;
    direction: DirectionState;
  }

  type PercentData = {
    date: Date;
    percentimeter: number;
  }

  type CycleData = {
    start_date: Date;
    end_date?: Date;
    is_running: boolean;
    start_state: {
      water: WaterState;
      direction: DirectionState;
    };
    cycle_states: Array<CycleStateData>;
    percent_history: Array<PercentData>;
  }

  type CycleResponseData = Array<Cycle> 

  // router.get('/readAll/:pivot_id', async(req, res, next) => {
  //   const {pivot_id, start_date, end_date} = req.params;

  //   let response: CycleResponseData = [];

  //   try {
  //     const cycles = await db.cycle.findMany({
  //       where: {pivot_id},
  //       orderBy: {timestamp: 'desc'},

  //     })
  //   }
  // })
  export default router;