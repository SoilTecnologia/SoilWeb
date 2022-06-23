import { FarmModel } from '@root/database/model/Farm';

interface IUpdateFarmService {
  execute({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    farm_name,
    user_id
  }: IUpdateFarmService.Params): IUpdateFarmService.Response;
}

namespace IUpdateFarmService {
  export type Params = FarmModel;
  export type Response = Promise<FarmModel | undefined>;
}

export { IUpdateFarmService };
