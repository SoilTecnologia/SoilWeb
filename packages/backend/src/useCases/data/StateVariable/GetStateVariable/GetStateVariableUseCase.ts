import { IGetPivotByIdRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetStateVariableService } from '@root/useCases/contracts/stateVariable/get-state';
import { inject, injectable } from 'tsyringe';
import { IPivotsRepository } from '../../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../../database/repositories/States/IState';
import { IStatesVariableRepository } from '../../../../database/repositories/StatesVariables/IStatesVariablesRepository';
import { dateString } from '../../../../utils/convertTimeZoneDate';
import { messageErrorTryAction } from '../../../../utils/types';

@injectable()
class GetStateVariableUseCase implements IGetStateVariableService {
  constructor(
    @inject('GetPivotById') private getPivot: IGetPivotByIdRepo,
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('StatesVariablesRepository')
    private stateVariableRepository: IStatesVariableRepository
  ) {}

  private async applyQueryGetStateVariable(state_id: string) {
    try {
      return await this.stateVariableRepository.findByStateId(state_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
      return DATABASE_ERROR;
    }
  }

  private async applyQueryGetState(pivot_id: string) {
    try {
      return await this.stateRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
      return DATABASE_ERROR;
    }
  }

  private async applyQueryGetPivotById(pivot_id: string) {
    try {
      return await this.getPivot.get({ pivot_id });
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        GetStateVariableUseCase.name,
        'Find Pivot By Pivot Id'
      );
      return DATABASE_ERROR;
    }
  }

  async execute({
    pivot_id
  }: IGetStateVariableService.Params): IGetStateVariableService.Response {
    const pivot = await this.applyQueryGetPivotById(pivot_id);
    /*
      Check pivot exists
    */

    if (pivot === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!pivot) throw new DataNotFound('Pivot');

    /*
      Check state of pivot exists
    */
    const state = await this.applyQueryGetState(pivot_id);

    if (state === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!state) throw new DataNotFound('State');

    /*
      Check state variable of state exists
    */
    const stateVariable = await this.applyQueryGetStateVariable(state.state_id);

    if (stateVariable === DATABASE_ERROR) throw new DatabaseErrorReturn();
    else if (!stateVariable) throw new DataNotFound('State Variable');

    return {
      ...stateVariable,
      timestamp: dateString(stateVariable?.timestamp)
    };
  }
}

export { GetStateVariableUseCase };
