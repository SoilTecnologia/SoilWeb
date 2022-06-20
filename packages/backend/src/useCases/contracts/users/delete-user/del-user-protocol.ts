import { DatabaseError } from '@root/protocols/errors';

type Responsedata = {
  status: 'OK' | 'FAIL';
};

interface IDeleteUserService {
  execute({ user_id }: IDeleteUserService.Params): IDeleteUserService.Response;
}

namespace IDeleteUserService {
  export type Params = { user_id: string };
  export type Response = Promise<Responsedata>;
}

export { IDeleteUserService };
