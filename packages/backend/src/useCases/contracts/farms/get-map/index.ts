import { FarmModel } from '@root/database/model/Farm';

interface IGetMapFarmsService {
  execute({
    farm_id
  }: IGetMapFarmsService.Params): IGetMapFarmsService.Response;
}

namespace IGetMapFarmsService {
  export type Params = { farm_id: string };
  export type Response = Promise<FarmModel[]>;
}

export { IGetMapFarmsService };
