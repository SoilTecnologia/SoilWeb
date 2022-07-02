import '@tests/setup/unit/setup';

import { mock, MockProxy } from 'jest-mock-extended';

import { IGetByDataRepo } from '@root/database/protocols';
import { ILoginAuth } from '@root/useCases/contracts';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  FailedCreateDataError,
  InvalidCredentials
} from '@root/protocols/errors';
import {
  ICompareEncrypt,
  AuthSignInUseCase,
  ITokenJwt
} from '@root/useCases/data';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';
import { UserModel } from '@root/database/model/User';

describe('Auth Login', () => {
  let findUserRepo: MockProxy<IGetByDataRepo>;
  let encrypter: MockProxy<ICompareEncrypt>;
  let token: MockProxy<ITokenJwt>;

  let authLogin: ILoginAuth;
  let dataLogin: ILoginAuth.Params;

  beforeAll(() => {
    findUserRepo = mock();
    encrypter = mock();
    token = mock();

    authLogin = new AuthSignInUseCase(token, encrypter, findUserRepo);
    dataLogin = { login: 'soil', password: 'soiltech' };

    findUserRepo.get.mockResolvedValue(userCreated);
    encrypter.compare.mockResolvedValue(true);
    token.create.mockResolvedValue('token_valid');
  });

  // Tests params receiveds
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(authLogin, 'execute');
    authLogin.execute(dataLogin);

    expect(callUser).toHaveBeenCalledWith(dataLogin);
    expect(callUser).toBeCalledTimes(1);
  });

  // Validation user data

  it('should to throw error Invalid Credentials, if password not correctly', () => {
    encrypter.compare.mockResolvedValueOnce(false);

    const promise = authLogin.execute({ ...dataLogin, password: '4321' });

    expect(promise).rejects.toThrow(new InvalidCredentials());
  });

  it('should to throw err Invalid Credentials if user not exists in database', () => {
    findUserRepo.get.mockResolvedValueOnce(undefined);

    const promise = authLogin.execute(dataLogin);

    expect(promise).rejects.toThrow(new InvalidCredentials());
  });
  // Tests Database

  it('should findUserRepo to have been called with data valids to have called once time', async () => {
    const fnFindUser = jest.spyOn(findUserRepo, 'get');

    await authLogin.execute(dataLogin);

    expect(fnFindUser).toHaveBeenCalledWith({
      table: 'users',
      column: 'login',
      data: 'soil'
    });
    expect(fnFindUser).toBeCalledTimes(1);
  });

  it('should throw database error, when repository findUserByLogin return error', () => {
    jest.spyOn(findUserRepo, 'get').mockResolvedValueOnce(DATABASE_ERROR);
    const promise = authLogin.execute(dataLogin);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  //Tests Encrypter
  it('should encrypted password to have been called with data valids to have called once time', async () => {
    findUserRepo.get.mockResolvedValueOnce(userCreated);
    const fnEncrypted = jest.spyOn(encrypter, 'compare');

    await authLogin.execute(dataLogin);

    expect(fnEncrypted).toHaveBeenCalledWith({
      password: 'soiltech',
      password_encrypted: userCreated?.password
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('Should to have error if compare encrypter return error', async () => {
    jest
      .spyOn(encrypter, 'compare')
      .mockResolvedValueOnce('BCRYPT COMPARE ERROR');

    const promise = authLogin.execute(addUser);

    expect(promise).rejects.toThrow(new Error('BCRYPT COMPARE ERROR'));
  });

  it('Should to have error if compare encrypter return null', async () => {
    jest
      .spyOn(encrypter, 'compare')
      .mockRejectedValueOnce(new InvalidCredentials());

    const promise = authLogin.execute(addUser);

    expect(promise).rejects.toThrow(new InvalidCredentials());
  });

  //Token
  it('should create jwt to have been called with data valids and to have called once time', async () => {
    const fnToken = jest.spyOn(token, 'create');

    await authLogin.execute(dataLogin);

    expect(fnToken).toHaveBeenCalledWith(userCreated);
    expect(fnToken).toBeCalledTimes(1);
  });

  it('should to have created token with data valids', async () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce('soiltech');

    const value = await authLogin.execute(dataLogin);

    expect(value).toHaveProperty('token', 'soiltech');
  });

  it('should throw error with token return null ', () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce(null);

    const promise = authLogin.execute(dataLogin);
    expect(promise).rejects.toThrow(new FailedCreateDataError('token jwt'));
  });

  it('should return error if ocurred error created token', () => {
    jest.spyOn(token, 'create').mockRejectedValueOnce(new Error());

    const promise = authLogin.execute(dataLogin);
    expect(promise).rejects.toThrow();
  });

  // Result ok

  it('should to have a userResponse valid with token válid, if receied params válid for login user', async () => {
    const promise = await authLogin.execute(dataLogin);

    expect(promise).toHaveProperty('user_id', userCreated?.user_id);
    expect(promise).toHaveProperty('token', 'token_valid');
    expect(promise).toHaveProperty('user_type', userCreated?.user_type);
  });
});
