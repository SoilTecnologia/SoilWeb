import { NodeModel } from '@root/database/model/Node';

interface IUpdateNodeService {
  execute({ node }: IUpdateNodeService.Params): IUpdateNodeService.Response;
}

namespace IUpdateNodeService {
  export type Params = { node: NodeModel };
  export type Response = Promise<NodeModel | undefined>;
}

export { IUpdateNodeService };
