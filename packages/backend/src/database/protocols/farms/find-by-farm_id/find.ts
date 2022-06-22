import { FarmModel } from '@root/database/model/Farm';

interface IFindFarmByIdRepo {
  find({
    farm_id
  }: IFindFarmByIdRepo.Params): Promise<IFindFarmByIdRepo.Response>;
}

namespace IFindFarmByIdRepo {
  export type Params = { farm_id: string };
  export type Response = FarmModel | undefined;
}

export { IFindFarmByIdRepo };
