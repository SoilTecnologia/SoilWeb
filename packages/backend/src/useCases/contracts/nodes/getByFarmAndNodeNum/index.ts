import { NodeModel } from '@root/database/model/Node';

interface IGetByFarmAndNodeNumService {
  execute({
    farm_id,
    node_num
  }: IGetByFarmAndNodeNumService.Params): IGetByFarmAndNodeNumService.Response;
}

namespace IGetByFarmAndNodeNumService {
  export type Params = { farm_id: string; node_num: number };
  export type Response = Promise<NodeModel | undefined>;
}

export { IGetByFarmAndNodeNumService };
