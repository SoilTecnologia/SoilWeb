import { FarmModel } from '@root/database/model/Farm';

interface IGetAllFarmsRepo {
  getAll(): IGetAllFarmsRepo.Response;
}

namespace IGetAllFarmsRepo {
  export type Response = Promise<FarmModel[] | undefined>;
}

export { IGetAllFarmsRepo };
