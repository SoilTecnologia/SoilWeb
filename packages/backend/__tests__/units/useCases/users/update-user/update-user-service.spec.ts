import { mock, MockProxy } from 'jest-mock-extended';
import {
  DatabaseErrorReturn,
  DataNotFound,
  NotUpdateError,
  ParamsEquals
} from '@protocols/errors';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { IUpdateUserRepo, IFindUserByIdRepo } from '@database/protocols';
import { IUpdateUserService } from '@root/useCases/contracts';
import {
  UpdateUserUseCase,
  IEncrypter,
  ICompareEncrypt
} from '@root/useCases/data';

describe('Update User Use Case', () => {
  let putUserRepo: MockProxy<IUpdateUserRepo>;
  let findUserRepo: MockProxy<IFindUserByIdRepo>;
  let encrypter: MockProxy<IEncrypter>;
  let CompareEncrypter: MockProxy<ICompareEncrypt>;

  let putUserService: IUpdateUserService;

  beforeEach(() => {
    putUserRepo = mock();
    findUserRepo = mock();
    encrypter = mock();
    CompareEncrypter = mock();

    putUserService = new UpdateUserUseCase(
      findUserRepo,
      putUserRepo,
      encrypter,
      CompareEncrypter
    );

    CompareEncrypter.compare.mockResolvedValue(true);
    findUserRepo.findById.mockResolvedValue({
      ...userCreated!,
      login: 'isDiferrent'
    });
    putUserRepo.update.mockResolvedValue(userCreated);
    encrypter.encrypt.mockResolvedValue('password_encrypted');
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(putUserService, 'execute');
    putUserService.execute(userCreated!);

    expect(callUser).toHaveBeenCalledWith(userCreated);
    expect(callUser).toBeCalledTimes(1);
  });

  // Tests created user in database response
  // findUser
  it('should create user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findUserRepo, 'findById');

    await putUserService.execute(userCreated!);

    expect(fnEncrypted).toHaveBeenCalledWith({ id: 'soiltech' });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw find user database error, when repository find user return error', () => {
    jest.spyOn(findUserRepo, 'findById').mockRejectedValueOnce(new Error());

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw user not exists, if repository not return user', () => {
    jest.spyOn(findUserRepo, 'findById').mockResolvedValueOnce(undefined);

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  // Compare datas

  it('should throw error, if received data equal a old user', () => {
    jest.spyOn(findUserRepo, 'findById').mockResolvedValueOnce(userCreated!);

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new ParamsEquals());
  });

  it('should throw error, if compare password return error', () => {
    CompareEncrypter.compare.mockResolvedValueOnce('BCRYPT COMPARE ERROR');

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new Error('BCRYPT COMPARE ERROR'));
  });

  // // Encrypter
  it('should encrypted password to have been called with data valids to have called once time', async () => {
    CompareEncrypter.compare.mockResolvedValueOnce(false);
    const fnEncrypted = jest.spyOn(encrypter, 'encrypt');

    await putUserService.execute(userCreated!);

    expect(fnEncrypted).toHaveBeenCalledWith({ value: '123456' });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should encrypted password return password encrypted ', async () => {
    CompareEncrypter.compare.mockResolvedValueOnce(false);
    const callUserCreated = jest.spyOn(putUserRepo, 'update');
    await putUserService.execute(userCreated!);

    expect(callUserCreated).toHaveBeenCalledWith({
      ...userCreated,
      password: 'password_encrypted'
    });
  });

  it('Should received an error if encrypted throw a error', () => {
    CompareEncrypter.compare.mockResolvedValueOnce(false);
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce('ENCRYPT ERROR');

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new Error('ENCRYPT ERROR'));
  });

  // // putUser
  it('should updte user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(putUserRepo, 'update');

    await putUserService.execute(userCreated!);

    expect(fnEncrypted).toHaveBeenCalledWith(userCreated);
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw user not updated, if repository not return user', () => {
    jest.spyOn(putUserRepo, 'update').mockResolvedValueOnce(undefined);

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new NotUpdateError('User'));
  });

  it('should throw database error, when repository update user return error', () => {
    jest.spyOn(putUserRepo, 'update').mockRejectedValueOnce(new Error());

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // //Test response useCases

  it('should a user to have  updated', async () => {
    const promise = await putUserService.execute(userCreated!);

    expect(promise).toHaveProperty('user_id', userCreated?.user_id);
    expect(promise).toHaveProperty('user_type', userCreated?.user_type);
    expect(promise).toHaveProperty('login', userCreated?.login);
    expect(promise).toHaveProperty('password');
  });
});
