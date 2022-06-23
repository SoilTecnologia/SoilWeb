import { FarmModel } from '@root/database/model/Farm';
type Responsedata = {
  status: 'OK' | 'FAIL';
};

interface IDeleteFarmService {
  execute({ farm_id }: IDeleteFarmService.Params): IDeleteFarmService.Response;
}

namespace IDeleteFarmService {
  export type Params = { farm_id: string };
  export type Response = Promise<Responsedata>;
}

export { IDeleteFarmService };
