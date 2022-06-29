import { NodeModel } from '@root/database/model/Node';

interface ICreateNodeService {
  execute(node: ICreateNodeService.Params): ICreateNodeService.Response;
}

namespace ICreateNodeService {
  export type Params = Omit<NodeModel, 'node_id'>;
  export type Response = Promise<NodeModel | undefined>;
}

export { ICreateNodeService };
