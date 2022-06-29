import { NodeModel } from '@root/database/model/Node';

interface IGetAllByFarmService {
  execute({
    farm_id
  }: IGetAllByFarmService.Params): IGetAllByFarmService.Response;
}

namespace IGetAllByFarmService {
  export type Params = { farm_id: string };
  export type Response = Promise<NodeModel[] | undefined>;
}

export { IGetAllByFarmService };
