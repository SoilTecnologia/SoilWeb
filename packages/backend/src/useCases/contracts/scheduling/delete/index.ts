type Responsedata = {
  status: 'OK' | 'FAIL';
};
interface IDeleteSchedulingService {
  execute({
    scheduling_id
  }: IDeleteSchedulingService.Params): IDeleteSchedulingService.Response;
}

namespace IDeleteSchedulingService {
  export type Params = { scheduling_id: string };
  export type Response = Promise<Responsedata>;
}

export { IDeleteSchedulingService };
