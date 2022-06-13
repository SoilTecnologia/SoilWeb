import { AddUserModel } from '../../../../useCases/User/CreateUser/protocols/ICreateUser';
import { UserModel } from '../../../model/User';

interface IAddNewUser{
  create(newUser: AddUserModel): Promise<UserModel>;
}

export {IAddNewUser}