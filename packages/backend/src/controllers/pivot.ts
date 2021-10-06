import {
  Pivot,
  Farm,
  Cycle,
  CycleState,
  CycleVariable,
  PowerState
} from '@prisma/client';
import { Console } from 'console';
import { connect } from 'http2';
import db from '../database';

export const createPivotController = async (
  farm_id: Farm['farm_id'],
  node_id: Pivot['node_id'],
  pivot_name: Pivot['pivot_name'],
  lng: Pivot['lng'],
  lat: Pivot['lat'],
  start_angle: Pivot['start_angle'],
  end_angle: Pivot['end_angle'],
  radius: Pivot['radius']
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

export const deletePivotController = async (pivot_id: Pivot['pivot_id']) => {
  const cycles = await db.cycle.findMany({ where: { pivot_id } });

  for (let cycle of cycles) {
    const cycle_id = cycle.cycle_id;
    const cycleStates = await db.cycleState.findMany({ where: { cycle_id } });

    for (let cycleState of cycleStates) {
      const cycle_state_id = cycleState.cycle_state_id;

      await db.cycleVariable.deleteMany({ where: { cycle_state_id } });
      await db.cycleState.delete({ where: { cycle_state_id } });
    }

    await db.cycle.delete({ where: { cycle_id } });
  }

  await db.pivot.delete({ where: { pivot_id } });
  console.log('PIVO DELETEADO');
  return true;
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

type FilteredCycleState = Pick<
  CycleState,
  'water' | 'direction' | 'connection'
>;

type FilteredCycleVariable = Pick<
  CycleVariable,
  'angle' | 'percentimeter' | 'pressure'
>;

const hasStateChanged = (
  oldState: FilteredCycleState,
  newState: FilteredCycleState
): boolean => {
  return (
    oldState.water != newState.water ||
    oldState.direction != newState.direction ||
    oldState.connection != newState.connection
  );
};

const hasVariablesChanged = (
  oldVariables: FilteredCycleVariable,
  newVariables: FilteredCycleVariable
): boolean => {
  return (
    oldVariables.angle != newVariables.angle ||
    oldVariables.percentimeter != newVariables.percentimeter ||
    oldVariables.pressure != newVariables.pressure
  );
};

export const updatePivotController = async (
  pivot_id: Pivot['pivot_id'],
  power: PowerState,
  water: CycleState['water'],
  direction: CycleState['direction'],
  connection: CycleState['connection'],
  curr_angle: CycleVariable['angle'],
  percentimeter: CycleVariable['percentimeter']
) => {
  const lastCycle = await db.cycle.findFirst({ where: { pivot_id, is_running: true }, orderBy: {updatedAt: "desc"} });
  const cycle_id = lastCycle?.cycle_id;
  let changes = [];
  console.log()

  if (power == 'ON' || power == 'NULL') {
    if (lastCycle && lastCycle.is_running) {
      updateRunningCycle(cycle_id!, water, direction, connection, curr_angle, percentimeter);
    } else {
      if (power !== 'NULL') createNewCycle(pivot_id, water, direction, connection, curr_angle, percentimeter);
    }
  } else if (power == 'OFF') {
    if (lastCycle && lastCycle.is_running) {
      closeCycle(cycle_id!, curr_angle);
    }
  }

  return true;
};

const closeCycle = async(cycle_id: Cycle['cycle_id'], curr_angle: CycleVariable['angle']) => {
  const currentCycleState = await db.cycleState.findFirst({where: {cycle_id: cycle_id!}, orderBy: {updatedAt: 'desc'}})
  await db.cycleState.update({
    data: {
      end_angle: curr_angle
    },
    where: {
      cycle_state_id: currentCycleState?.cycle_state_id
    }
  })

  await db.cycle.update({
    where: {cycle_id},
    data: {is_running: false}
  })
}

const updateRunningCycle = async (cycle_id: Cycle['cycle_id'], water:CycleState['water'], direction: CycleState['direction'], connection:CycleState['connection'], curr_angle: CycleVariable['angle'], percentimeter: CycleVariable['percentimeter']) => {
  const currentCycleState = await db.cycleState.findFirst({where: {cycle_id: cycle_id!}, orderBy: {updatedAt: 'desc'}})
  const cycle_state_id = currentCycleState?.cycle_state_id;
  const currentCycleVariable = await db.cycleVariable.findFirst({where: {cycle_state_id}, orderBy: {updatedAt: 'desc'}})

  if(cycleVariablesChanged(currentCycleVariable!, {angle: curr_angle, percentimeter, pressure: 0})) {
    updateCycleVariables(cycle_state_id!, curr_angle, percentimeter, 0);
  }

  if(cycleStateChanged(currentCycleState!, {water, direction, connection})) {
    updateCycleState(cycle_id, cycle_state_id!, water, direction, connection, curr_angle);
  }
}

type FilteredVariables = Pick<CycleVariable, 'angle' | 'percentimeter' | 'pressure'>;
type FilteredState = Pick<CycleState, 'water' | 'direction' | 'connection'>;

const cycleVariablesChanged = (oldVariables: CycleVariable, newVariables: FilteredVariables): boolean => {
  const angleThreshold = 1;
  const percentThreshold = 5;
  const pressureThreshold = 5;

  return((newVariables.angle <= oldVariables.angle-angleThreshold || newVariables.angle >= oldVariables.angle + angleThreshold) || (newVariables.percentimeter <= oldVariables.percentimeter-percentThreshold || newVariables.percentimeter >= oldVariables.percentimeter+percentThreshold) || (newVariables.pressure <= oldVariables.pressure-pressureThreshold || newVariables.percentimeter >= oldVariables.percentimeter+percentThreshold)) 
}

const cycleStateChanged = (oldState: CycleState, newState: FilteredState): boolean => {
  return(oldState.water != newState.water || oldState.direction != newState.direction || oldState.connection != newState.connection) 
}

const updateCycleVariables = async (cycle_state_id: CycleState['cycle_state_id'], curr_angle: CycleVariable['angle'], percentimeter: CycleVariable['percentimeter'], pressure: CycleVariable['pressure']) => {
  await db.cycleVariable.create({data: {
    angle: curr_angle,
    percentimeter,
    pressure,
    cycle_state_id
  }})
}

const updateCycleState = async (cycle_id: Cycle['cycle_id'] , cycle_state_id: CycleState['cycle_state_id'], water: CycleState['water'], direction: CycleState['direction'], connection: CycleState['connection'], curr_angle: CycleVariable['angle']) => {
  await db.cycleState.update({data: {
    end_angle: curr_angle
  }, where: {cycle_state_id}})

  await db.cycleState.create({data: {
    cycle_id,
    water,
    direction,
    connection,
    start_angle: curr_angle,
    end_angle: curr_angle
  }})
}

const createNewCycle = async (
  pivot_id: Pivot['pivot_id'],
  water: CycleState['water'],
  direction: CycleState['direction'],
  connection: CycleState['connection'],
  curr_angle: CycleVariable['angle'],
  percentimeter: CycleVariable['percentimeter']
) => {
  const newCycle = await db.cycle.create({
    data: { pivot_id, is_running: true }
  });
  const newCycleState = await db.cycleState.create({
    data: {
      cycle_id: newCycle.cycle_id,
      water,
      direction,
      connection,
      start_angle: curr_angle,
      end_angle: curr_angle
    }
  });
  const newCycleVariable = await db.cycleVariable.create({
    data: {
      angle: curr_angle,
      percentimeter,
      pressure: 0,
      cycle_state_id: newCycleState.cycle_state_id
    }
  })

  return {cycle: newCycle, cycleState: newCycleState, cycleVariable: newCycleVariable};
};

/*
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
*/
