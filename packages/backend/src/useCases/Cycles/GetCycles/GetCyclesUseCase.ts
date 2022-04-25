import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../../database/model/State';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { createDate } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';

type PartialCycleResponse = {
  start_date: Date;
  end_date: Date;
  is_running: boolean;
  start_state: {
    power: StateModel['power'];
    water: StateModel['water'];
    direction: StateModel['direction'];
  };
  states: Array<{
    power: StateModel['power'];
    water: StateModel['water'];
    direction: StateModel['direction'];
    connection: StateModel['connection'];
    timestamp: Date | string;
  }>;
  percentimeters: Array<{ value: number; timestamp: Date | string }>;
};
type fullCycleResponse = Array<PartialCycleResponse>;

@injectable()
class GetCyclesUseCase {
  private response: fullCycleResponse;

  private foundStart: boolean;

  private currentCycle: PartialCycleResponse = {
    states: [],
    percentimeters: []
  } as unknown as PartialCycleResponse;

  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariablesRepository: IStatesVariableRepository
  ) {
    this.foundStart = false;
    this.response = [] as fullCycleResponse;
  }

  private async applyQueryGetVariableGroupBt(state_id: string) {
    try {
      return await this.stateVariablesRepository.getVariableGroupBy(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetCyclesUseCase.name,
        'Get Variable GroupBy'
      );
    }
  }

  private async applyQueryGetStoryCycle(
    pivot_id: string,
    start: string,
    end: string
  ) {
    try {
      return await this.stateRepository.getHistoryCycle(pivot_id, start, end);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetCyclesUseCase.name,
        'Get Story Cycle'
      );
    }
  }

  async execute(pivot_id: StateModel['pivot_id'], start: string, end: string) {
    // Get all status from a pivot and order it by last to more recent
    const states = await this.applyQueryGetStoryCycle(pivot_id, start, end);
    /* 
    This will loop over all the states,
    once it finds a state with power = true,
    it will start a new cycle,
    and will add the state to the cycle,
    until it finds a state with power = false
  */

    for (let state of states!!) {
      if (this.foundStart) {
        if (state.power === false) {
          this.currentCycle!.is_running = false;
          this.currentCycle!.end_date = state.timestamp;
          this.currentCycle!.states.push({
            power: state.power,
            water: state.water,
            direction: state.direction,
            timestamp: createDate(state.timestamp),
            connection: state.connection
          });

          this.response.push(this.currentCycle!);
          this.foundStart = false;
          this.currentCycle = {
            states: [],
            percentimeters: []
          } as unknown as PartialCycleResponse;
        } else {
          this.currentCycle!.states.push({
            power: state.power,
            water: state.water,
            direction: state.direction,
            timestamp: createDate(state.timestamp),
            connection: state.connection
          });
        }
      } else {
        if (state.power) {
          this.foundStart = true;
          this.currentCycle!.start_date = state.timestamp;
          this.currentCycle!.is_running = true;
          this.currentCycle!.start_state = {
            power: state.power,
            water: state.water,
            direction: state.direction
          };
          this.currentCycle!.states.push({
            power: state.power,
            water: state.water,
            direction: state.direction,
            timestamp: createDate(state.timestamp),
            connection: state.connection
          });
        }
      }

      const variables = await this.applyQueryGetVariableGroupBt(state.state_id);

      if (!variables) throw new Error('Does Not Find Variables');

      for (let variable of variables) {
        if (variable)
          this.currentCycle!.percentimeters.push({
            value: variable.percentimeter!,
            timestamp: createDate(variable.timestamp!)
          });
      }
    }

    // If there's one that started but hasn't ended, make sure to send it too
    if (this.foundStart)
      // if(this.currentCycle.states.length > 0 || this.currentCycle.percentimeters.length > 0) {
      this.response.push(this.currentCycle);
    // }

    // Return the reverse so that most recent cycles are shown
    return this.response.reverse();
  }
}

export { GetCyclesUseCase };
