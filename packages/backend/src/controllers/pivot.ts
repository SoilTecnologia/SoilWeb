import {
  Farm,
  Pivot,
  Radio,
  Cycle,
  CycleState,
  CycleVariable,
  Node,
  PowerState
} from '@prisma/client';
import db from '../database';
import authMiddleware from '../middlewares/auth';

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
  pivots = pivots.sort((a, b) => (a.pivot_name > b.pivot_name ? 1 : -1));

  return pivots;
};

export const updatePivotController = async (
  pivot_name: Pivot['pivot_name'],
  connection: CycleState['connection'],
  node_id?: Node['node_id'],
  power?: PowerState,
  water?: CycleState['water'],
  direction?: CycleState['direction'],
  curr_angle?: CycleVariable['angle'],
  percentimeter?: CycleVariable['percentimeter']
) => {
  let pivot;
  if (node_id) {
    pivot = await db.pivot.findFirst({ where: { node_id, pivot_name } });
  }

  pivot = await db.pivot.findFirst({ where: { pivot_name } });
  const { pivot_id } = pivot!;

  const lastCycle = await db.cycle.findFirst({
    where: { pivot_id, is_running: true },
    orderBy: { updatedAt: 'desc' }
  });
  const cycle_id = lastCycle?.cycle_id;
  // console.log(
  //   `Tentando atualizar cycle: power: ${power}, connection:${connection}, water:${water}, direction:${direction}, curr_angle: ${curr_angle}`
  // );

  let changes = [];

  if (connection == 'ONLINE') {
    // console.log('ONLINE!');
    if (power === 'ON') {
      // console.log("POWER ON")
      if (lastCycle && lastCycle.is_running) {
        // console.log(lastCycle)
        await updateRunningCycle(
          cycle_id!,
          connection,
          water,
          direction,
          curr_angle,
          percentimeter
        );
      } else {
        // console.log("SEM LAST CYCLE")
        await createNewCycle(
          pivot_id,
          connection,
          water!,
          direction!,
          curr_angle!,
          percentimeter!
        );
      }
    } else if (power == 'OFF') {
      if (lastCycle && lastCycle.is_running) {
        await closeCycle(cycle_id!, curr_angle!);
      }
    }
  } else {
    // console.log('OFFLINE!');
    if (lastCycle && lastCycle.is_running) {
      // console.log('updateRunningCycle soh com connection!');
      await updateRunningCycle(cycle_id!, connection);
    }
  }

  return true;
};

const closeCycle = async (
  cycle_id: Cycle['cycle_id'],
  curr_angle: CycleVariable['angle']
) => {
  const currentCycleState = await db.cycleState.findFirst({
    where: { cycle_id: cycle_id! },
    orderBy: { updatedAt: 'desc' }
  });

  await db.cycleState.update({
    data: {
      end_angle: curr_angle
    },
    where: {
      cycle_state_id: currentCycleState?.cycle_state_id
    }
  });

  await db.cycle.update({
    where: { cycle_id },
    data: { is_running: false }
  });
};

const updateRunningCycle = async (
  cycle_id: Cycle['cycle_id'],
  connection: CycleState['connection'],
  water?: CycleState['water'],
  direction?: CycleState['direction'],
  curr_angle?: CycleVariable['angle'],
  percentimeter?: CycleVariable['percentimeter']
) => {
  const currentCycleVariable = await db.cycleVariable.findFirst({
    orderBy: { updatedAt: 'desc' }
  });

  if (connection == 'ONLINE') {
    const cycle_state_id = await updateCycleState(
      cycle_id,
      connection,
      water,
      direction,
      curr_angle
    );
    await updateCycleVariables(
      cycle_id,
      cycle_state_id!,
      connection,
      curr_angle!,
      percentimeter!,
      0
    );
  } else {
    // console.log('ATUALIZANDFO SOH CYCLE STATE');
    await updateCycleState(cycle_id, connection);
  }
};

type FilteredVariables = Pick<
  CycleVariable,
  'angle' | 'percentimeter' | 'pressure'
>;
type FilteredState = Partial<Pick<CycleState, 'water' | 'direction'>> &
  Pick<CycleState, 'connection'>;

const cycleVariablesChanged = (
  oldVariables: CycleVariable,
  newVariables: FilteredVariables
): boolean => {
  const angleThreshold = 1;
  const percentThreshold = 5;
  const pressureThreshold = 5;

  return (
    newVariables.angle <= oldVariables.angle - angleThreshold ||
    newVariables.angle >= oldVariables.angle + angleThreshold ||
    newVariables.percentimeter <=
      oldVariables.percentimeter - percentThreshold ||
    newVariables.percentimeter >=
      oldVariables.percentimeter + percentThreshold ||
    newVariables.pressure <= oldVariables.pressure - pressureThreshold ||
    newVariables.percentimeter >= oldVariables.percentimeter + percentThreshold
  );
};

const cycleStateChanged = (
  oldState: CycleState,
  newState: FilteredState
): boolean => {
  return (
    oldState.connection != newState.connection ||
    oldState.water != newState.water ||
    oldState.direction != newState.direction
  );
};

const updateCycleVariables = async (
  cycle_id: Cycle['cycle_id'],
  cycle_state_id: CycleState['cycle_state_id'],
  connection: CycleState['connection'],
  curr_angle?: CycleVariable['angle'],
  percentimeter?: CycleVariable['percentimeter'],
  pressure?: CycleVariable['pressure']
) => {
  const currentCycleVariable = await db.cycleVariable.findFirst({
    where: { cycle_id },
    orderBy: { updatedAt: 'desc' }
  });

  // console.log(connection, curr_angle, currentCycleVariable?.cycle_state_id);
  if (connection == 'ONLINE') {
    if (
      cycleVariablesChanged(currentCycleVariable!, {
        angle: curr_angle!,
        percentimeter: percentimeter!,
        pressure: pressure!
      })
    ) {
      await db.cycleVariable.create({
        data: {
          angle: curr_angle!,
          percentimeter: percentimeter!,
          pressure: pressure!,
          cycle_state_id: cycle_state_id,
          cycle_id,
          timestamp: new Date(Date.now())
        }
      });
    }
  }
  // console.log('TERMINEI CYCLE VARIABLES');
};

const updateCycleState = async (
  cycle_id: Cycle['cycle_id'],
  connection: CycleState['connection'],
  water?: CycleState['water'],
  direction?: CycleState['direction'],
  curr_angle?: CycleVariable['angle']
) => {
  const currentCycleState = await db.cycleState.findFirst({
    where: { cycle_id: cycle_id! },
    orderBy: { updatedAt: 'desc' }
  });
  let cycle_state_id = currentCycleState?.cycle_state_id;

  if (connection == 'ONLINE') {
    if (
      cycleStateChanged(currentCycleState!, { connection, direction, water })
    ) {
      await db.cycleState.update({
        data: {
          end_angle: curr_angle
        },
        where: { cycle_state_id }
      });

      const newCycleState = await db.cycleState.create({
        data: {
          cycle_id,
          water: water!,
          direction: direction!,
          connection,
          start_angle: curr_angle!,
          end_angle: curr_angle!,
          timestamp: new Date(Date.now())
        }
      });

      cycle_state_id = newCycleState.cycle_state_id;
    }
  } else {
    if (
      cycleStateChanged(currentCycleState!, { connection, direction, water })
    ) {
      const lastCycleVariable = await db.cycleVariable.findFirst({
        where: { cycle_state_id },
        orderBy: { updatedAt: 'desc' }
      });
      // console.log(lastCycleVariable?.angle);
      if (lastCycleVariable) {
        await db.cycleState.update({
          data: {
            end_angle: lastCycleVariable.angle
          },
          where: { cycle_state_id }
        });
        const newCycleState = await db.cycleState.create({
          data: {
            cycle_id,
            water: 'NULL',
            direction: 'NULL',
            connection,
            start_angle: lastCycleVariable.angle,
            end_angle: lastCycleVariable.angle,
            timestamp: new Date(Date.now())
          }
        });

        cycle_state_id = newCycleState.cycle_state_id;
      }
    }
  }

  return cycle_state_id;
};

const createNewCycle = async (
  pivot_id: Pivot['pivot_id'],
  connection: CycleState['connection'],
  water: CycleState['water'],
  direction: CycleState['direction'],
  curr_angle: CycleVariable['angle'],
  percentimeter: CycleVariable['percentimeter']
) => {
  // console.log('TRYINFGGG');
  // console.log(pivot_id);
  const newCycle = await db.cycle.create({
    data: { pivot_id, is_running: true, timestamp: new Date(Date.now()) }
  });
  const newCycleState = await db.cycleState.create({
    data: {
      cycle_id: newCycle.cycle_id,
      water,
      direction,
      connection,
      start_angle: curr_angle,
      end_angle: curr_angle,
      timestamp: new Date(Date.now())
    }
  });

  const newCycleVariable = await db.cycleVariable.create({
    data: {
      angle: curr_angle,
      percentimeter,
      pressure: 0,
      cycle_state_id: newCycleState.cycle_state_id,
      cycle_id: newCycle.cycle_id,
      timestamp: new Date(Date.now())
    }
  });

  return {
    cycle: newCycle,
    cycleState: newCycleState,
    cycleVariable: newCycleVariable
  };
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
