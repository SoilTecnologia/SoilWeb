import { ICreateUserRepository } from '@root/database/protocols/users';
import { ICreateUserUseCase } from '@root/useCases/contracts/users/create-user/create-user-protocol';

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
