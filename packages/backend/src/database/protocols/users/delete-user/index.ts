interface IDeleteUserRepo {
  deleteUser({ user_id }: IDeleteUserRepo.Params): IDeleteUserRepo.Response;
}

namespace IDeleteUserRepo {
  export type Params = { user_id: string };
  export type Response = Promise<number | undefined>;
}

export { IDeleteUserRepo };
