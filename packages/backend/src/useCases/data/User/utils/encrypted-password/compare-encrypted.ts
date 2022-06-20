import bcrypt from 'bcrypt';
import { ICompareEncrypt } from './protocols';

class BCryptCompare implements ICompareEncrypt {
  async compare({
    password,
    password_encrypted
  }: ICompareEncrypt.Params): ICompareEncrypt.Response {
    try {
      return await bcrypt.compare(password, password_encrypted);
    } catch (err) {
      console.log('ERROR WHEN COMPARE PASSWORD');
      const error = err as Error;
      console.log(error.message);
      return 'BCRYPT COMPARE ERROR';
    }
  }
}

export { BCryptCompare };
