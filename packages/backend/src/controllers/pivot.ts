import { Pivot, Farm, CycleState, CycleVariable } from '@prisma/client';
import { Console } from 'console';
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

  console.log("PIVO CRIADO")
  return newPivo;
};

export const deletePivotController = async (pivot_id: Pivot['pivot_id']) => {
  const cycles = await db.cycle.findMany({where: {pivot_id}});

  for(let cycle of cycles) { 
    const cycle_id = cycle.cycle_id;
    const cycleStates = await db.cycleState.findMany({where: {cycle_id}});

    for(let cycleState of cycleStates) {
      const cycle_state_id = cycleState.cycle_state_id;

      await db.cycleVariable.deleteMany({where: {cycle_state_id}});
      await db.cycleState.delete({where: {cycle_state_id}})
    }

    await db.cycle.delete({where: {cycle_id}});
  };

  await db.pivot.delete({where: {pivot_id}})
  console.log("PIVO DELETEADO")
  return true;
}

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
  let changes = [];

  if (power === 'ON' || power === 'NULL') {
    if (lastCycle && lastCycle.is_running) {
      console.log('is running')
      let lastCycleState = await db.cycleState.findFirst({
        where: { cycle_id }
      });
      if (lastCycleState) {
        console.log("last cycle state exists")
        if (
          hasStateChanged(lastCycleState, {
            power,
            water,
            direction,
            connection
          })
        ) {
          console.log("state changed")
          const result = await db.cycleState.update({
            where: { cycle_state_id: lastCycleState.cycle_state_id },
            data: { end_angle: curr_angle }
          });

          changes.push(result);

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

          changes.push(lastCycleState);
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
          changes.push(lastCycleState);
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
          console.log("VARIABLES CHANGED!!")
          if (connection == 'ONLINE') {
            console.log("cycle variable online created")
      console.log(lastCycleState.cycle_state_id)
            const newCycleVariable = await db.cycleVariable.create({
              data: {
                angle: curr_angle,
                percentimeter,
                pressure: 0,
                cycle_state_id: lastCycleState.cycle_state_id
              }
            });

            changes.push(newCycleVariable);
          } else {
            console.log("cycle variable offline created")
            const result = await db.cycleVariable.create({
              data: {
                angle: lastCycleState.end_angle,
                percentimeter: 0,
                pressure: 0,
                cycle_state_id: lastCycleState.cycle_id
              }
            });

            changes.push(result);
          }
        }
      }
      //TODO Checar para on_off = 2 para setar is_running false
    } else {
      console.log("BATEU AQUI")
      const newCycle = await db.cycle.create({ data: { pivot_id } });
      changes.push(newCycle);
      console.log("EAGUI")
      const newCycleState = await db.cycleState.create({
        data: {
          power,
          water,
          direction,
          connection,
          start_angle: curr_angle,
          end_angle: curr_angle,
          cycle_id: newCycle.cycle_id,
        }
      });
      changes.push(newCycleState);
      console.log("EAQUI")
      console.log(newCycleState.cycle_state_id)
      console.log("percentimenter", percentimeter)
      const newCycleVariable = await db.cycleVariable.create({
        data: {
          angle: curr_angle,
          percentimeter,
          pressure: 0,
          cycle_state_id: newCycleState.cycle_state_id
        }
      });
      changes.push(newCycleVariable);
    }
  } else {
    if (lastCycle && lastCycle.is_running) {
      const result = await db.cycle.update({
        where: { cycle_id: lastCycle.cycle_id },
        data: { is_running: false }
      });

      changes.push(result);

      const lastCycleState = await db.cycleState.findFirst({
        where: { cycle_id: lastCycle.cycle_id }
      });


      const result2 = await db.cycleState.update({
        where: {
          cycle_state_id: lastCycleState?.cycle_state_id
        },
        data: {
          connection,
          direction,
          end_angle: curr_angle,
          power,
          water
        }
      });

      changes.push(result2);
    }
  }
  return changes;
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
