import { FarmModel } from '@root/database/model/Farm';
import { ICreateFarmUseCase } from '@root/useCases/contracts/farms/create/create-farm-protocol';

interface ICreateFarmRepo {
  create(newFarm: ICreateFarmUseCase.Params): Promise<ICreateFarmRepo.Response>;
}

namespace ICreateFarmRepo {
  export type Params = ICreateFarmUseCase.Params;
  export type Response = FarmModel | undefined;
}

export { ICreateFarmRepo };
