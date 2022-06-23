import { FarmModel } from '@root/database/model/Farm';

interface ICreateFarmUseCase {
  execute(
    account: ICreateFarmUseCase.Params
  ): Promise<ICreateFarmUseCase.Response>;
}

namespace ICreateFarmUseCase {
  export type Params = FarmModel;

  export type Response = Promise<FarmModel | undefined>;
}

export { ICreateFarmUseCase };
