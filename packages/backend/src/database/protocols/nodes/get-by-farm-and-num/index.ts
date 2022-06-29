import { NodeModel } from '@root/database/model/Node';
import { DatabaseError } from '@root/protocols/errors';

interface IGetByFarmAndNodeNumRepo {
  get({
    farm_id,
    node_num
  }: IGetByFarmAndNodeNumRepo.Params): IGetByFarmAndNodeNumRepo.Response;
}

namespace IGetByFarmAndNodeNumRepo {
  export type Params = { farm_id: string; node_num: number };
  export type Response = Promise<NodeModel | undefined | DatabaseError>;
}

export { IGetByFarmAndNodeNumRepo };
