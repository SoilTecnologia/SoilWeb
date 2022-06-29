import { NodeModel } from '@root/database/model/Node';

interface IGetOneNodeService {
  execute({ node_id }: IGetOneNodeService.Params): IGetOneNodeService.Response;
}

namespace IGetOneNodeService {
  export type Params = { node_id: string };
  export type Response = Promise<NodeModel | undefined>;
}

export { IGetOneNodeService };
