import {
  Prisma,
  PrismaClient,
  Pivot,
  Farm,
  CycleState,
  CycleVariable
} from '@prisma/client';

const db = new PrismaClient();

export const createPivotController = async (
  farm_id: Farm['farm_id'],
  pivot_name: Pivot['pivot_name'],
  lng: Pivot['lng'],
  lat: Pivot['lat'],
  start_angle: Pivot['start_angle'],
  end_angle: Pivot['end_angle'],
  radius: Pivot['radius']
): Promise<Pivot | null> => {
  const newPivo = await db.pivot.create({
    data: {
      farm_id,
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
  const pivot = await db.pivot.findUnique({ where: { pivot_id } });

  return pivot;
};

export const readAllPivotController = async (
  farm_id: Pivot['farm_id']
): Promise<Pivot[] | null> => {
  const pivots = await db.pivot.findMany({ where: { farm_id } });

  return pivots;
};

export const updatePivotController = async (
  pivot_id: Pivot['pivot_id'],
  farm_id?: Pivot['farm_id'],
  pivot_name?: Pivot['pivot_name'],
  lng?: Pivot['lng'],
  lat?: Pivot['lat'],
  start_angle?: Pivot['start_angle'],
  end_angle?: Pivot['end_angle'],
  radius?: Pivot['radius']
): Promise<Pivot | null> => {
  const updatedPivot = await db.pivot.update({
    data: {
      farm_id,
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

type ExpectedForMap = {
  pivot_id: Pivot['pivot_id'];
  cycle: {
    isRunning: boolean;
    cycle_states?: CycleState[];
    cycle_variables?: CycleVariable[];
  };
};

export const readPivotsForMapController = async (
  farm_id: Farm['farm_id']
): Promise<ExpectedForMap[] | null> => {
  const pivots = await db.pivot.findMany({
    where: {
      farm_id
    }
  });

  let response: ExpectedForMap[] = [];

  pivots.forEach(async (pivot) => {
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

  return response;
};
