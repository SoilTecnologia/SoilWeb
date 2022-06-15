import bcrypt from "bcrypt";
import { IEncrypter } from './protocols';

class BcryptAdapter implements IEncrypter {
  private salt = 10
  async encrypt(value: string): Promise<string | Error> {
    try{
      const hash = await bcrypt.hash(value, this.salt);
      return hash;
    }catch(err){
      return err
    }
    
  }
}

export { BcryptAdapter };