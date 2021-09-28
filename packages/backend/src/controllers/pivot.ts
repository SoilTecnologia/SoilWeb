import {
  Pivot,
  Farm,
  CycleState,
  CycleVariable
} from '@prisma/client';
import db from '../database'

export const createPivotController = async (
  node_id: Pivot['node_id'],
  pivot_name: Pivot['pivot_name'],
  lng: Pivot['lng'],
  lat: Pivot['lat'],
  start_angle: Pivot['start_angle'],
  end_angle: Pivot['end_angle'],
  radius: Pivot['radius'],
): Promise<Pivot | null> => {
  const newPivo = await db.pivot.create({
    data: {
      node_id,
      pivot_name,
      lng,
      lat,
      start_angle,
      end_angle,
      radius
    }
  });

  return newPivo;
};

export const readOnePivotController = async (
  pivot_id: Pivot['pivot_id']
): Promise<Pivot | null> => {
  const pivot = await db.pivot.findUnique({
    where: { pivot_id }
  });

  return pivot;
};

export const readAllPivotController = async (
  farm_id: Farm['farm_id']
): Promise<Pivot[] | null> => {
  const nodes = await db.node.findMany({
    where: { farm_id },
    select: { pivots: true }
  });

  let pivots: Pivot[] = [];

  nodes.forEach((node) => node.pivots.forEach((pivot) => pivots.push(pivot)));

  return pivots;
};

export const updatePivotController = async (
  pivot_id: Pivot['pivot_id'],
  node_id?: Pivot['node_id'],
  pivot_name?: Pivot['pivot_name'],
  lng?: Pivot['lng'],
  lat?: Pivot['lat'],
  start_angle?: Pivot['start_angle'],
  end_angle?: Pivot['end_angle'],
  radius?: Pivot['radius']
): Promise<Pivot | null> => {
  const updatedPivot = await db.pivot.update({
    data: {
      node_id,
      pivot_name,
      lng,
      lat,
      start_angle,
      end_angle,
      radius
    },
    where: {
      pivot_id
    }
  });

  return updatedPivot;
};

export const readPivotsForMapController = async (
  farm_id: Farm['farm_id']
): Promise<ExpectedForMap[] | null> => {
  const nodes = await db.node.findMany({
    where: {
      farm_id
    },
    select: {
      pivots: true
    }
  });

  let response: ExpectedForMap[] = [];

  nodes.forEach(async (node) => {
    node.pivots.forEach(async (pivot) => {
      const { pivot_id } = pivot;

      const cycle = await db.cycle.findFirst({
        where: {
          pivot_id
        },
        orderBy: {
          updatedAt: 'desc'
        }
      });

      if (!cycle?.is_running) {
        response.push({
          pivot_id,
          cycle: { isRunning: false }
        });
      } else {
        const cycleStates = await db.cycleState.findMany({
          where: { cycle_id: cycle.cycle_id }
        });

        const cycleVariables = await db.cycleVariable.findMany({
          where: { cycle_id: cycle.cycle_id }
        });

        response.push({
          pivot_id,
          cycle: {
            isRunning: true,
            cycle_states: cycleStates,
            cycle_variables: cycleVariables
          }
        });
      }
    });
  });

  return response;
};

type ExpectedForMap = {
  pivot_id: Pivot['pivot_id'];
  cycle: {
    isRunning: boolean;
    cycle_states?: CycleState[];
    cycle_variables?: CycleVariable[];
  };
};
