import { container, inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { GetLastCycleUseCase } from '../../Cycles/GetLastCycles/GetLastCycleUseCase';

@injectable()
class ReadPivotStateUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('StatesRepository') private statesRepository: IStateRepository
  ) {}

  async execute(pivot_id: PivotModel['pivot_id']) {
    const getLastCycleUseCase = container.resolve(GetLastCycleUseCase);
    const pivot = await this.pivotRepository.findById(pivot_id);

    const state = await this.statesRepository.findByPivotId(pivot_id);
    const variables = await getLastCycleUseCase.execute(pivot_id);

    const variableIsNotEmpty = variables && variables.length > 0;
    const stateAndVariable = state && variableIsNotEmpty;

    const result = {
      pivot_id,
      pivot_num: pivot!.pivot_num,
      pivot_lng: pivot!.pivot_lng,
      pivot_lat: pivot!.pivot_lat,
      pivot_start_angle: pivot!.pivot_start_angle,
      pivot_end_angle: pivot!.pivot_end_angle,
      pivot_radius: pivot!.pivot_radius,
      power: state ? state.power : false,
      water: state ? state.water : false,
      direction: state ? state.direction : null,
      connection: state ? state.connection : true,
      percentimeter: stateAndVariable
        ? variables[variables.length - 1]!.percentimeter
        : 0,
      start_angle: stateAndVariable ? variables[0]!.angle : null,
      end_angle: stateAndVariable
        ? variables[variables.length - 1]!.angle
        : null
    };

    return result;
  }
}

export { ReadPivotStateUseCase };
