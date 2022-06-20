import { mock, MockProxy } from 'jest-mock-extended';
import { IEncrypter } from '@root/useCases/data/User/utils/encrypted-password/protocols';
import { ITokenJwt } from '@root/useCases/data/User/utils/token-jwt/protocols';
import { CreateUserUseCase } from '@root/useCases/data/User/CreateUser/CreateUserUseCase';
import { ICreateUserUseCase } from '@root/useCases/contracts/users/create-user/create-user-protocol';
import {
  ICreateUserRepository,
  IFindUserByLoginRepo
} from '@database/protocols/users';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  FailedCreateDataError
} from '@protocols/errors';
import {
  addUser,
  userCreated,
  userResponse
} from '@tests/mocks/data/users/user-values-for-mocks';

describe('Create User Use Case', () => {
  let addUserRepo: MockProxy<ICreateUserRepository>;
  let findUserRepo: MockProxy<IFindUserByLoginRepo>;

  let encrypter: MockProxy<IEncrypter>;
  let token: MockProxy<ITokenJwt>;
  let createUserService: ICreateUserUseCase;
  let addUserEncrypted: ICreateUserRepository.Params;

  beforeEach(() => {
    addUserRepo = mock();
    findUserRepo = mock();
    encrypter = mock();
    token = mock();

    createUserService = new CreateUserUseCase(
      token,
      encrypter,
      addUserRepo,
      findUserRepo
    );

    addUserEncrypted = { ...addUser, password: 'password_encrypted' };

    findUserRepo.findUserByLogin.mockResolvedValue(undefined);
    addUserRepo.create.mockResolvedValue(userCreated);
    encrypter.encrypt.mockResolvedValue('password_encrypted');
    token.create.mockResolvedValue('token_valid');
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(createUserService, 'execute');
    createUserService.execute(addUser);

    expect(callUser).toHaveBeenCalledWith(addUser);
    expect(callUser).toBeCalledTimes(1);
  });

  // Tests encrypted password response
  it('should encrypted password to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(encrypter, 'encrypt');

    await createUserService.execute(addUser);

    expect(fnEncrypted).toHaveBeenCalledWith({ value: '123456' });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should encrypted password return password encrypted ', async () => {
    const callUserCreated = jest.spyOn(addUserRepo, 'create');
    await createUserService.execute(addUser);

    expect(callUserCreated).toHaveBeenCalledWith({
      ...addUser,
      password: 'password_encrypted'
    });
  });

  it('should to have created token with data valids', async () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce('soiltech');

    const value = await createUserService.execute(addUser);

    expect(value).toHaveProperty('token', 'soiltech');
  });

  it('should to have error if encrypter to throw ', async () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce(null);

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow(new Error('Does not create token jwt'));
  });
  // Tests created user in database response
  it('should create user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(addUserRepo, 'create');

    await createUserService.execute(addUser);

    expect(fnEncrypted).toHaveBeenCalledWith(addUserEncrypted);
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should find user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findUserRepo, 'findUserByLogin');

    await createUserService.execute(addUser);

    expect(fnEncrypted).toHaveBeenCalledWith('soil');
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw error if user is not created in database', async () => {
    addUserRepo.create.mockResolvedValueOnce(undefined);

    const err = createUserService.execute(addUser);

    expect(err).rejects.toThrow(new FailedCreateDataError('User'));
  });

  it('should to throw error if user received already exists in database', async () => {
    findUserRepo.findUserByLogin.mockResolvedValueOnce(userCreated);

    const err = createUserService.execute(addUser);

    expect(err).rejects.toThrow(new AlreadyExistsError('User'));
  });

  //Tests Jwt Token response

  it('should create jwt to have been called with data valids and to have called once time', async () => {
    const fnToken = jest.spyOn(token, 'create');

    await createUserService.execute(addUser);

    expect(fnToken).toHaveBeenCalledWith(userCreated);
    expect(fnToken).toBeCalledTimes(1);
  });

  it('should to have created token with data valids', async () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce('soiltech');

    const value = await createUserService.execute(addUser);

    expect(value).toHaveProperty('token', 'soiltech');
  });

  it('should throw error with token return null ', () => {
    jest.spyOn(token, 'create').mockResolvedValueOnce(null);

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow(new Error('Does not create token jwt'));
  });

  //Test response useCases
  it('should return error if ocurred error created token', () => {
    jest.spyOn(token, 'create').mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow();
  });

  it('Should received an error if encrypted throw a error', () => {
    jest.spyOn(encrypter, 'encrypt').mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow();
  });

  it('Should received an error if encrypted return a error', () => {
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce(new Error());

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow();
  });

  it('should throw database error, when repository create return error', () => {
    jest.spyOn(addUserRepo, 'create').mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw database error, when repository findUserByLogin return error', async () => {
    jest
      .spyOn(findUserRepo, 'findUserByLogin')
      .mockRejectedValueOnce(new Error());
    const promise = createUserService.execute(addUser);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to have a userResponse valid with token válid, if receied params válid for login user', async () => {
    const promise = await createUserService.execute(addUser);

    expect(promise).toHaveProperty('user_id', userCreated?.user_id);
    expect(promise).toHaveProperty('token', 'token_valid');
    expect(promise).toHaveProperty('user_type', userCreated?.user_type);
  });
});
