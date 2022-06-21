import bcrypt from 'bcrypt';
import { IEncrypter } from './protocols';

class BcryptAdapter implements IEncrypter {
  private salt = 10;
  async encrypt({ value }: IEncrypter.Params): IEncrypter.Response {
    try {
      const hash = await bcrypt.hash(value, this.salt);
      return hash;
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      return 'ENCRYPT ERROR';
    }
  }
}

export { BcryptAdapter };
