import { UserModel } from '@root/database/model/User';
import { ICreateUserRepository } from '@root/database/protocols';
import { ICreateUserUseCase } from '@root/useCases/contracts';

export const addUser: ICreateUserUseCase.Params = {
  login: 'soil',
  password: '123456',
  user_type: 'SUDO'
};

export const userCreated: ICreateUserRepository.Response = {
  user_id: 'soiltech',
  login: 'soil',
  password: '123456',
  user_type: 'SUDO'
};

export const userResponse = {
  user_id: 'soiltech',
  user_type: 'SUDO',
  token: 'soiltech'
};

export const usersArray: UserModel[] = [
  userCreated!,
  {
    user_id: 'soiltech_2',
    login: 'soil_2',
    password: '123456',
    user_type: 'USER'
  },
  {
    user_id: 'soiltech_3',
    login: 'soil_3',
    password: '123456',
    user_type: 'SUDO'
  }
];
