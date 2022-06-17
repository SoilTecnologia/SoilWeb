import { IFindUserByLogin } from '@root/database/protocols/users';
import { ILoginAuth } from '@root/database/protocols/users/auth-login/login-auth';
import { AuthSignInUseCase } from '@root/useCases/User/AuthSignInUser/AuthLoginUseCase';
import {
  ICompareEncrypt,
  IEncrypter
} from '@root/useCases/User/utils/encrypted-password/protocols';
import { ITokenJwt } from '@root/useCases/User/utils/token-jwt/protocols';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
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

  it('should to throw error, with password diferrent of the database password', async () => {
    encrypter.compare.mockResolvedValueOnce(false);

    const promise = await authLogin.execute({ ...dataLogin, password: '4321' });

    console.log(promise);
    expect(promise).rejects.toThrow(new Error('Invalid Credentials'));
  });
});
