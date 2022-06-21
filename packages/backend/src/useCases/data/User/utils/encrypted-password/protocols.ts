interface IEncrypter {
  encrypt(value: IEncrypter.Params): IEncrypter.Response;
}

interface ICompareEncrypt {
  compare({
    password,
    password_encrypted
  }: ICompareEncrypt.Params): ICompareEncrypt.Response;
}

namespace ICompareEncrypt {
  export type Params = { password: string; password_encrypted: string };
  export type Response = Promise<boolean | undefined | 'BCRYPT COMPARE ERROR'>;
}

namespace IEncrypter {
  export type Params = { value: string };
  export type Response = Promise<string | 'ENCRYPT ERROR'>;
}

export { IEncrypter, ICompareEncrypt };
