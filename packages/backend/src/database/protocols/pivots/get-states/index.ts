import { PivotModel } from '@root/database/model/Pivot';
import { StateModel } from '@root/database/model/State';
import { StateVariableModel } from '@root/database/model/StateVariables';

interface IGetPivotStateAndVariablesRepo {
  get({
    pivot_id
  }: IGetPivotStateAndVariablesRepo.Params): IGetPivotStateAndVariablesRepo.Response;
}

namespace IGetPivotStateAndVariablesRepo {
  export type DataFullPivot = PivotModel & StateModel & StateVariableModel;
  export type Params = { pivot_id: string };
  export type Response = Promise<DataFullPivot | undefined>;
}

export { IGetPivotStateAndVariablesRepo };
