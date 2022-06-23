import { FarmModel } from '@root/database/model/Farm';

interface IDeleteFarmRepo {
  delete({ farm_id }: IDeleteFarmRepo.Params): IDeleteFarmRepo.Response;
}

namespace IDeleteFarmRepo {
  export type Params = { farm_id: string };
  export type Response = Promise<number | undefined>;
}

export { IDeleteFarmRepo };
