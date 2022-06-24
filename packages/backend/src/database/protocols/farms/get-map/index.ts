import { FarmModel } from '@root/database/model/Farm';
import { NodeModel } from '@root/database/model/Node';

interface IGetMapFarmRepo {
  get({ farm_id }: IGetMapFarmRepo.Params): IGetMapFarmRepo.Response;
}

namespace IGetMapFarmRepo {
  export type MapFarm = NodeModel & FarmModel;

  export type Params = { farm_id: string };
  export type Response = Promise<MapFarm[] | undefined>;
}

export { IGetMapFarmRepo };
