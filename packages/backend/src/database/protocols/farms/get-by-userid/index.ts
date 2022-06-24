import { FarmModel } from '@root/database/model/Farm';

interface IGetFarmByUserIdRepo {
  getAll({
    user_id
  }: IGetFarmByUserIdRepo.Params): IGetFarmByUserIdRepo.Response;
}

namespace IGetFarmByUserIdRepo {
  export type Params = { user_id: string };
  export type Response = Promise<FarmModel[] | undefined>;
}

export { IGetFarmByUserIdRepo };
