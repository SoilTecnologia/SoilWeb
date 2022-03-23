import { container, inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { PartialMapResponse } from '../../../database/model/types/pivot';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { GetLastCycleUseCase } from '../../Cycles/GetLastCycles/GetLastCycleUseCase';

@injectable()
class ReadMapUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('FarmsRepository') private farmRepository: IFarmsRepository,
    @inject('NodesRepository') private nodeRepository: INodesRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository
  ) {}

  private handlePivotsResult = async (pivots: PivotModel[]) => {
    const getLastCycleUseCase = container.resolve(GetLastCycleUseCase);
    const newArray: PartialMapResponse[] = [];

    for (let pivot of pivots) {
      const state = await this.stateRepository.findByPivotId(pivot.pivot_id);
      const variables = await getLastCycleUseCase.execute(pivot.pivot_id);

      const isTrue = state && variables && variables.length > 0;

      const statePivot: PartialMapResponse = {
        pivot_id: pivot.pivot_id,
        pivot_lng: pivot.pivot_lng,
        pivot_lat: pivot.pivot_lat,
        pivot_num: pivot.pivot_num,
        pivot_start_angle: pivot.pivot_start_angle,
        pivot_end_angle: pivot.pivot_end_angle,
        pivot_radius: pivot.pivot_radius,
        power: isTrue ? state.power : false,
        water: isTrue ? state.water : false,
        direction: isTrue ? state.direction : null,
        connection: isTrue ? state.connection : true,
        start_angle: isTrue ? variables[0]!.angle : pivot.pivot_start_angle,
        end_angle: isTrue
          ? variables[variables.length - 1]!.angle
          : pivot.pivot_start_angle
      };
      newArray.push(statePivot);
    }

    return newArray;
  };

  async execute(farm_id: PivotModel['farm_id']) {
    const farm = await this.farmRepository.findById(farm_id);
    const pivots = await this.pivotRepository.getAll(farm_id);

    const pivotArray = await this.handlePivotsResult(pivots);

    return {
      farm_lat: farm!.farm_lat,
      farm_lng: farm!.farm_lng,
      pivots: pivotArray
    };
  }
}

export { ReadMapUseCase };
