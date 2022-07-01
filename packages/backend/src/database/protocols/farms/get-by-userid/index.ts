import { FarmModel } from '@root/database/model/Farm';
import { DatabaseError } from '@root/protocols/errors';

interface IGetFarmByUserIdRepo {
  getAll({
    user_id
  }: IGetFarmByUserIdRepo.Params): IGetFarmByUserIdRepo.Response;
}

namespace IGetFarmByUserIdRepo {
  export type Params = { user_id: string };
  export type Response = Promise<FarmModel[] | undefined | DatabaseError>;
}

export { IGetFarmByUserIdRepo };
