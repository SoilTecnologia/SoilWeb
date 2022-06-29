import { StateVariableModel } from '@root/database/model/StateVariables';

interface IGetStateVariableService {
  execute({
    pivot_id: string
  }: IGetStateVariableService.Params): IGetStateVariableService.Response;
}

namespace IGetStateVariableService {
  export type NotTimestamp = Omit<StateVariableModel, 'timestamp'>;
  export type timeString = { timestamp: string };
  export type Params = { pivot_id: string };
  export type Response = Promise<NotTimestamp & timeString>;
}

export { IGetStateVariableService };
