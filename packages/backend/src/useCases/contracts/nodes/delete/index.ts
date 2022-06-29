type Responsedata = {
  status: 'OK' | 'FAIL';
};

interface IDeleteNodeService {
  execute({ node_id }: IDeleteNodeService.Params): IDeleteNodeService.Response;
}

namespace IDeleteNodeService {
  export type Params = { node_id: string };
  export type Response = Promise<Responsedata>;
}

export { IDeleteNodeService };
