import { FarmModel } from '@root/database/model/Farm';

interface IUpdateFarmRepo {
  update({
    farm_id,
    farm_city,
    farm_lat,
    farm_lng,
    farm_name,
    user_id
  }: IUpdateFarmRepo.Params): Promise<IUpdateFarmRepo.Response>;
}

namespace IUpdateFarmRepo {
  export type Params = FarmModel;
  export type Response = FarmModel | undefined;
}

export { IUpdateFarmRepo };
