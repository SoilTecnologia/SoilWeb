import {
  PrismaClient,
  Pivot,
  Cycle,
  CycleState,
  CycleVariable
} from '@prisma/client';
import db from '../database';

type CustomCycleState = {
  water: CycleState['water'];
  direction: CycleState['direction'];
  connection: CycleState['connection'];
  start_angle: CycleState['start_angle'];
  end_angle: CycleState['end_angle'];
  variables: Array<Pick<CycleVariable, 'angle' | 'percentimeter' | 'pressure'>>;
};

type FullCycle = {
  is_running: boolean;
  cycleStates: Array<CustomCycleState>;
};

type CycleData = {
  power: boolean;
  direction?: CycleState['direction'];
  water?: CycleState['water'];
  percentimeter?: CycleVariable['percentimeter'];
  // voltage?: ;
  pressure?: CycleVariable['pressure'];
};

export const readCycleController = async (
  pivot_id: string
): Promise<CycleData | null> => {
  let pivotData: CycleData;

  const cycle = await db.cycle.findFirst({
    where: { pivot_id, is_running: true }
  });

  if (cycle) {
    const cycleState = await db.cycleState.findFirst({
      where: { cycle_id: cycle.cycle_id },
      orderBy: { updatedAt: 'desc' }
    });
    const cycleVariable = await db.cycleVariable.findFirst({
      where: { cycle_id: cycle.cycle_id },
      orderBy: { updatedAt: 'desc' }
    });


    return {
      power: true,
      direction: cycleState!.direction,
      water: cycleState!.water,
      percentimeter: cycleVariable!.percentimeter,
      pressure: cycleVariable!.pressure
    }
  } else {
    return {
      power: false
    };
  }
};

export const readAllCycleController = async (
  pivot_id: Pivot['pivot_id']
): Promise<FullCycle | null> => {
  let response: FullCycle = { is_running: false, cycleStates: [] };

  const cycle = await db.cycle.findFirst({ where: { pivot_id } });
  if (cycle) {
    response.is_running = cycle.is_running;

    const cycleStates = await db.cycleState.findMany({
      where: { cycle_id: cycle.cycle_id }
    });

    let customCycleStates: Array<CustomCycleState> = [];
    for (let cycleState of cycleStates) {
      const cycleVariables = await db.cycleVariable.findMany({
        where: { cycle_state_id: cycleState.cycle_state_id }
      });
      customCycleStates.push({
        water: cycleState.water,
        direction: cycleState.direction,
        connection: cycleState.connection,
        start_angle: cycleState.start_angle,
        end_angle: cycleState.end_angle,
        variables: cycleVariables
      });
    }

    response.cycleStates = customCycleStates;
  }
  return response;
};
