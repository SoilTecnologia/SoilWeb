import { Pivot, Farm, CycleState, CycleVariable } from '@prisma/client';
import { connect } from 'http2';
import db from '../database';

export const createPivotController = async (
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
  'power' | 'water' | 'direction' | 'connection'
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
    oldState.power != newState.power ||
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
  power: CycleState['power'],
  water: CycleState['water'],
  direction: CycleState['direction'],
  connection: CycleState['connection'],
  curr_angle: CycleVariable['angle'],
  percentimeter: CycleVariable['percentimeter']
) => {
  const lastCycle = await db.cycle.findFirst({ where: { pivot_id } });
  const cycle_id = lastCycle?.cycle_id;

  if (lastCycle && lastCycle.is_running) {
    let lastCycleState = await db.cycleState.findFirst({
      where: { cycle_id }
    });
    if (lastCycleState) {
      if (
        hasStateChanged(lastCycleState, { power, water, direction, connection })
      ) {
        await db.cycleState.update({
          where: { cycle_state_id: lastCycleState.cycle_state_id },
          data: { end_angle: curr_angle }
        });

        if (connection == 'ONLINE') {
          lastCycleState = await db.cycleState.create({
            data: {
              power,
              water,
              direction,
              connection,
              start_angle: curr_angle,
              end_angle: curr_angle,
              cycle_id: lastCycle.cycle_id
            }
          });
        } else {
          let tempLastCycleState = await db.cycleState.create({
            data: {
              power: 'NULL',
              water: 'NULL',
              direction: 'NULL',
              connection: 'OFFLINE',
              start_angle: lastCycleState.end_angle,
              end_angle: lastCycleState.end_angle,
              cycle_id: lastCycle.cycle_id
            }
          });

          lastCycleState = tempLastCycleState;
        }
      }

      const lastCycleVariable = await db.cycleVariable.findFirst({
        where: { cycle_state_id: lastCycleState.cycle_state_id }
      });
      if (
        !lastCycleVariable ||
        hasVariablesChanged(lastCycleVariable, {
          angle: curr_angle,
          percentimeter,
          pressure: 0
        })
      ) {
        if (connection == 'ONLINE') {
          const newCycleVariable = db.cycleVariable.create({
            data: {
              angle: curr_angle,
              percentimeter,
              pressure: 0,
              cycle_state_id: lastCycleState.cycle_state_id
            }
          });
        } else {
          await db.cycleVariable.create({
            data: {
              angle: lastCycleState.end_angle,
              percentimeter: 0,
              pressure: 0,
              cycle_state_id: lastCycleState.cycle_id
            }
          });
        }
      }
    }

    //TODO Checar para on_off = 2 para setar is_running false
  } else {
    const newCycle = await db.cycle.create({ data: { pivot_id } });
    const newCycleState = await db.cycleState.create({
      data: {
        power,
        water,
        direction,
        connection,
        start_angle: curr_angle,
        end_angle: curr_angle,
        cycle_id: newCycle.cycle_id
      }
    });
    const newCycleVariable = await db.cycleVariable.create({
      data: {
        angle: curr_angle,
        percentimeter,
        pressure: 0,
        cycle_state_id: newCycleState.cycle_state_id
      }
    });
  }
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
