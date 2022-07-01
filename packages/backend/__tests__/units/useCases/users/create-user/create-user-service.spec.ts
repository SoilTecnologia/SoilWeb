import 'reflect-metadata';
import { mock, MockProxy } from 'jest-mock-extended';
import { CreateUserUseCase, ITokenJwt, IEncrypter } from '@root/useCases/data';
import { ICreateUserUseCase } from '@root/useCases/contracts';
import { ICreateBaseRepo, IGetByDataRepo } from '@database/protocols';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  FailedCreateDataError
} from '@protocols/errors';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';

describe('Create User Use Case', () => {
  let addUserRepo: MockProxy<ICreateBaseRepo>;
  let findUserRepo: MockProxy<IGetByDataRepo>;

  let encrypter: MockProxy<IEncrypter>;
  let token: MockProxy<ITokenJwt>;
  let createUserService: ICreateUserUseCase;
  let addUserEncrypted: ICreateUserUseCase.Params;

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

    findUserRepo.get.mockResolvedValue(undefined);
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
    const callUserCreated = jest.spyOn(encrypter, 'encrypt');
    await createUserService.execute(addUser);

    expect(callUserCreated).toHaveBeenCalledWith({ value: addUser.password });
  });

  it('Should received an error if encrypted throw a error', () => {
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce('ENCRYPT ERROR');

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow(new Error('ENCRYPT ERROR'));
  });

  // Tests created user in database response
  it('should create user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(addUserRepo, 'create');

    await createUserService.execute(addUser);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'users',
      data: addUserEncrypted
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should find user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findUserRepo, 'get');

    await createUserService.execute(addUser);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'users',
      data: 'soil',
      column: 'login'
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw create user database error, when repository create return error', () => {
    jest.spyOn(addUserRepo, 'create').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw database error, when repository findUserByLogin return error', () => {
    jest.spyOn(findUserRepo, 'get').mockResolvedValueOnce(DATABASE_ERROR);
    const promise = createUserService.execute(addUser);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw error if user received already exists in database', () => {
    findUserRepo.get.mockResolvedValueOnce(userCreated);

    const err = createUserService.execute(addUser);

    expect(err).rejects.toThrow(new AlreadyExistsError('User'));
  });

  it('should to throw error if create user return undefined', () => {
    addUserRepo.create.mockResolvedValueOnce(undefined);

    const err = createUserService.execute(addUser);

    expect(err).rejects.toThrow(new FailedCreateDataError('User'));
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
    expect(promise).rejects.toThrow(new FailedCreateDataError('token jwt'));
  });

  it('should to have error if token to throw ', async () => {
    jest.spyOn(token, 'create').mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser);
    expect(promise).rejects.toThrow();
  });

  //Test response useCases

  it('should to have a userResponse valid with token válid, if receied params válid for login user', async () => {
    const promise = await createUserService.execute(addUser);

    expect(promise).toHaveProperty('user_id', userCreated?.user_id);
    expect(promise).toHaveProperty('token', 'token_valid');
    expect(promise).toHaveProperty('user_type', userCreated?.user_type);
  });
});
