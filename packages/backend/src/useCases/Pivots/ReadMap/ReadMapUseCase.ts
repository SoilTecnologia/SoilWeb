import { container, inject, injectable } from 'tsyringe';
import { PivotModel } from '../../../database/model/Pivot';
import { PartialMapResponse } from '../../../database/model/types/pivot';
import { IFarmsRepository } from '../../../database/repositories/Farms/IFarmsRepository';
import { INodesRepository } from '../../../database/repositories/Nodes/INodesRepository';
import { IPivotsRepository } from '../../../database/repositories/Pivots/IPivotsRepository';
import { IStateRepository } from '../../../database/repositories/States/IState';
import { messageErrorTryAction } from '../../../utils/types';
import { GetLastCycleUseCase } from '../../Cycles/GetLastCycles/GetLastCycleUseCase';

@injectable()
class ReadMapUseCase {
  constructor(
    @inject('PivotsRepository') private pivotRepository: IPivotsRepository,
    @inject('FarmsRepository') private farmRepository: IFarmsRepository,
    @inject('NodesRepository') private nodeRepository: INodesRepository,
    @inject('StatesRepository') private stateRepository: IStateRepository
  ) {}

  private async applyQueryGetFarmById(farm_id: string) {
    try {
      return this.farmRepository.findById(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadMapUseCase.name,
        'Get Farm By Farm Id'
      );
    }
  }

  private async applyQueryGetAllPivotsByFarms(farm_id: string) {
    try {
      return this.pivotRepository.getAll(farm_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadMapUseCase.name,
        'Get Pivots By Farm Id'
      );
    }
  }

  private async applyQueryGetStateByPivot(pivot_id: string) {
    try {
      return this.stateRepository.findByPivotId(pivot_id);
    } catch (err) {
      messageErrorTryAction(
        err,
        true,
        ReadMapUseCase.name,
        'Get State By States'
      );
    }
  }

  private handlePivotsResult = async (pivots: PivotModel[]) => {
    const getLastCycleUseCase = container.resolve(GetLastCycleUseCase);
    const newArray: PartialMapResponse[] = [];

    for (let pivot of pivots) {
      const state = await this.applyQueryGetStateByPivot(pivot.pivot_id);
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
        power: state ? state.power : false,
        water: state ? state.water : false,
        direction: state ? state.direction : null,
        connection: state ? state.connection : false,
        start_angle: isTrue ? variables[0]!.angle : pivot.pivot_start_angle,
        end_angle: isTrue
          ? variables[variables.length - 1]!.angle
          : pivot.pivot_end_angle
      };
      newArray.push(statePivot);
    }

    return newArray;
  };

  async execute(farm_id: PivotModel['farm_id']) {
    const farm = await this.applyQueryGetFarmById(farm_id);
    const pivots = await this.applyQueryGetAllPivotsByFarms(farm_id);

    if (!farm) throw new Error('Farm does not find');
    if (!pivots) throw new Error('Pivots does not find');

    const pivotArray = await this.handlePivotsResult(pivots);

    return {
      farm_lat: farm!.farm_lat,
      farm_lng: farm!.farm_lng,
      pivots: pivotArray
    };
  }
}

export { ReadMapUseCase };
