import { StateModel } from '@root/database/model/State';

interface IGetStateByIdRepo {
  get({ state_id }: IGetStateByIdRepo.Params): IGetStateByIdRepo.Response;
}

namespace IGetStateByIdRepo {
  export type Params = { state_id: string };
  export type Response = Promise<StateModel | undefined>;
}

export { IGetStateByIdRepo };
