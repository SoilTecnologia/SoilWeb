import { IFindUserByLogin } from '@root/database/protocols/users';
import { ILoginAuth } from '@root/database/protocols/users/auth-login/login-auth';
import { DatabaseErrorReturn } from '@root/protocols/errors';
import { AuthSignInUseCase } from '@root/useCases/User/AuthSignInUser/AuthLoginUseCase';
import {
  ICompareEncrypt,
  IEncrypter
} from '@root/useCases/User/utils/encrypted-password/protocols';
import { ITokenJwt } from '@root/useCases/User/utils/token-jwt/protocols';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Auth Login', () => {
  let findUserRepo: MockProxy<IFindUserByLogin>;
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

    findUserRepo.findUserByLogin.mockResolvedValue(userCreated);
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

  it('should encrypted password to have been called with data valids to have called once time', async () => {
    findUserRepo.findUserByLogin.mockResolvedValueOnce(userCreated);
    const fnEncrypted = jest.spyOn(encrypter, 'compare');

    await authLogin.execute(dataLogin);

    expect(fnEncrypted).toHaveBeenCalledWith({
      password: 'soiltech',
      password_encrypted: userCreated?.password
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw error, with password diferrent of the database password', () => {
    encrypter.compare.mockResolvedValueOnce(false);

    const promise = authLogin.execute({ ...dataLogin, password: '4321' });

    expect(promise).rejects.toThrow(new Error('Invalid Credentials'));
  });

  // Tests Database

  it('should to throw errr Invalid Credentials if user not exists in database', () => {
    findUserRepo.findUserByLogin.mockResolvedValueOnce(undefined);

    const promise = authLogin.execute(dataLogin);

    expect(promise).rejects.toThrow(new Error('Invalid Credentials'));
  });

  it('should throw database error, when repository findUserByLogin return error', () => {
    jest
      .spyOn(findUserRepo, 'findUserByLogin')
      .mockRejectedValueOnce(new Error());
    const promise = authLogin.execute(dataLogin);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  //Tests Encrypter

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
      .mockRejectedValueOnce(new Error('Invalid Credentials'));

    const promise = authLogin.execute(addUser);

    expect(promise).rejects.toThrow(new Error('Invalid Credentials'));
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
    expect(promise).rejects.toThrow(new Error('Does not create token jwt'));
  });

  it('should return error if ocurred error created token', () => {
    jest.spyOn(token, 'create').mockRejectedValueOnce(new Error());

    const promise = authLogin.execute(dataLogin);
    expect(promise).rejects.toThrow();
  });

  it('should to have a userResponse valid with token válid, if receied params válid for login user', async () => {
    const promise = await authLogin.execute(dataLogin);

    expect(promise).toHaveProperty('user_id', userCreated?.user_id);
    expect(promise).toHaveProperty('token', 'token_valid');
    expect(promise).toHaveProperty('user_type', userCreated?.user_type);
  });
});
