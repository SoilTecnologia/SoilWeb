import dayjs from 'dayjs';
import { inject, injectable } from 'tsyringe';
import { StateModel } from '../../../database/model/State';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { dateString, dateIsAter, dateIsBefore } from '../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../utils/types';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { isPercentDiferent } from '../../../utils/isDifferent';


dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);

type PartialCycleResponse = {
  start_date: string;
  end_date: string;
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
    start : string | Date,
    end: string | Date
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

  handleDate(date: string, hour:number){
    const [day,month,year] = date.split('-')
    const ha = dayjs(`${year}-${month}-${day}`)
    .tz('America/Sao_Paulo').add(1,"day")
    .second(0).hour(hour).minute(0).subtract(3, "hour")
    return ha.toDate()
  }

  checkPercent(percents: number[]){

  }

  async execute(pivot_id: StateModel['pivot_id'], start: string, end: string) {
    // Get all status from a pivot and order it by last to more recent
    const startDate = this.handleDate(start,0)
    const endDate = this.handleDate(end,24)

    const states = await this.applyQueryGetStoryCycle(pivot_id, startDate, endDate);
    /* 
    This will loop over all the states,
    once it finds a state with power = true,
    it will start a new cycle,
    and will add the state to the cycle,
    until it finds a state with power = false
  */
    if(!states || states.length <= 0) {
      console.log("===============")
      console.log("Não exitem alterações de estado nesse periodo.")
      console.log("===============")
      return []
    }
    else{
      for (let state of states!!) {
        if (this.foundStart) {
          if (state.power === false) {
            this.currentCycle!.is_running = false;
            this.currentCycle!.end_date = dateString(state.timestamp);
            this.currentCycle!.states.push({
              power: state.power,
              water: state.water,
              direction: state.direction,
              timestamp: dateString(state.timestamp),
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
              timestamp: dateString(state.timestamp),
              connection: state.connection
            });
          }
        } 
        else {
          if (state.power) {
            this.foundStart = true;
            this.currentCycle!.start_date = dateString(state.timestamp);
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
              timestamp: dateString(state.timestamp),
              connection: state.connection
            });
          }
        }
  
        const variables = await this.applyQueryGetVariableGroupBt(state.state_id);
  
        if (!variables) throw new Error('Does Not Find Variables');
        
        let oldPercent : null | number = null
        console.log("Checagem do states: " + state.state_id);
        
        for (let variable of variables) {
          if(variable.percentimeter !== null){
            if( oldPercent === null || !isPercentDiferent(oldPercent, variable.percentimeter!) ){
              console.log(`Percent maior antigo antigo: ${oldPercent} Novo: ${variable.percentimeter!}`)
              const {percentimeters} = this.currentCycle

              if( percentimeters &&  percentimeters.length > 0 ){ 
                  const lastItem = percentimeters[percentimeters.length -1]
                  const percentEquals = isPercentDiferent(lastItem.value, variable.percentimeter)
                  !percentEquals && percentimeters.push({
                    value: variable.percentimeter!,
                    timestamp: dateString(variable.timestamp!)
                  }); 
              }else{
                this.currentCycle.percentimeters.push({
                  value: variable.percentimeter!,
                  timestamp: dateString(variable.timestamp!)
                }); 
              }
                     
            }else {
              console.log(`Intervalo de  percent curto ${oldPercent} Novo: ${variable.percentimeter!}`)
            }
  
              oldPercent = variable.percentimeter!
           }else{
             console.log(variable.percentimeter, " Percents")
           }
          
        }

        oldPercent = null
        console.log("....");

      }

  
      // If there's one that started but hasn't ended, make sure to send it too
      // if(this.currentCycle.states.length > 0 || this.currentCycle.percentimeters.length > 0) {
  
      if (this.foundStart) {
        this.response.push(this.currentCycle);
      }
      // }
  
      // Return the reverse so that most recent cycles are shown
      return this.response.reverse();
    }
  }

}

export { GetCyclesUseCase };
