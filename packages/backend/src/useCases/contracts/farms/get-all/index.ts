import { FarmModel } from '@root/database/model/Farm';

interface IGetAllFarmsService {
  execute(): IGetAllFarmsService.Response;
}

namespace IGetAllFarmsService {
  export type Response = Promise<FarmModel[] | undefined>;
}

export { IGetAllFarmsService };
