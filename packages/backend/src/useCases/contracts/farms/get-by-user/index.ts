import { FarmModel } from '@root/database/model/Farm';

interface IGetFarmByUserService {
  execute({
    user_id
  }: IGetFarmByUserService.Params): IGetFarmByUserService.Response;
}

namespace IGetFarmByUserService {
  export type Params = { user_id: string };
  export type Response = Promise<FarmModel[] | undefined>;
}

export { IGetFarmByUserService };
