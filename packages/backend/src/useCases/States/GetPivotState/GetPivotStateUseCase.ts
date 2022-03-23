import { container, inject, injectable } from 'tsyringe';
import { StateModel } from '../../../database/model/State';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { GetLastCycleUseCase } from '../../Cycles/GetLastCycles/GetLastCycleUseCase';

@injectable()
class GetPivotStateUseCase {
  constructor(
    @inject('StatesRepository') private stateRepository: IStateRepository,
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository
  ) {}

  async execute(pivot_id: StateModel['pivot_id']) {
    const getLastCycleUseCase = container.resolve(GetLastCycleUseCase);

    const pivot = await this.pivotRepository.findById(pivot_id);
    const state = await this.stateRepository.findByPivotId(pivot_id);

    const variables = await getLastCycleUseCase.execute(pivot_id);

    const variableIsNotEmpty = variables && variables.length > 0;
    const stateAnVariabes = state && variableIsNotEmpty;

    return {
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
      percentimeter: stateAnVariabes
        ? variables[variables.length - 1]!.percentimeter
        : 0,
      start_angle: stateAnVariabes ? variables[0]!.angle : null,
      end_angle: stateAnVariabes ? variables[variables.length - 1]!.angle : null
    };
  }
}

export { GetPivotStateUseCase };
