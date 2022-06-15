import jwt from 'jsonwebtoken';
import { UserModel } from '../../../../database/model/User';
import { ITokenJwt } from './protocols';

class CreateJwt implements ITokenJwt{
  private secretKey = process.env.NODE_ENV === "test" ? "testsoil" : process.env.TOKEN_SECRET

  async create(user: UserModel): Promise<ITokenJwt.Response> {
    try {
      const token = jwt.sign(
        {
          user_id: user.user_id,
          user_type: user.user_type
        },
        this.secretKey as jwt.Secret ,
        {
          expiresIn: '2h'
        }
      );
      return token;
    } catch (error) {
      console.log(error)
      return null
    }
  }

}

export {
  CreateJwt
}