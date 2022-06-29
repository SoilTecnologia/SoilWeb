import { PivotModel } from '@root/database/model/Pivot';

interface IGetPivotByIdRepo {
  get({ pivot_id }: IGetPivotByIdRepo.Params): IGetPivotByIdRepo.Rsponse;
}

namespace IGetPivotByIdRepo {
  export type Params = { pivot_id: string };
  export type Rsponse = Promise<PivotModel | undefined>;
}

export { IGetPivotByIdRepo };
