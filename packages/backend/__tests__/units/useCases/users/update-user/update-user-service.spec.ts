import { mock, MockProxy } from 'jest-mock-extended';
import { IEncrypter } from '@root/useCases/data/User/utils/encrypted-password/protocols';
import { IFindUserByIdRepo } from '@database/protocols/users';
import { DatabaseErrorReturn } from '@protocols/errors';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { IUpdateUserRepo } from '@root/database/protocols/users/update/IUpdateUserRepo';
import { IUpdateUserService } from '@root/useCases/contracts/users/update-user/update-user-protocol';
import { UpdateUserUseCase } from '@root/useCases/data/User/Updateuser/UpdateUserUseCase';

describe('Update User Use Case', () => {
  let putUserRepo: MockProxy<IUpdateUserRepo>;
  let findUserRepo: MockProxy<IFindUserByIdRepo>;
  let encrypter: MockProxy<IEncrypter>;

  let putUserService: IUpdateUserService;

  beforeEach(() => {
    putUserRepo = mock();
    findUserRepo = mock();
    encrypter = mock();

    putUserService = new UpdateUserUseCase(
      findUserRepo,
      putUserRepo,
      encrypter
    );
    findUserRepo.findById.mockResolvedValue(userCreated);
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
    expect(promise).rejects.toThrow(new Error('User does not find'));
  });

  // Encrypter
  it('should encrypted password to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(encrypter, 'encrypt');

    await putUserService.execute(userCreated!);

    expect(fnEncrypted).toHaveBeenCalledWith({ value: '123456' });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should encrypted password return password encrypted ', async () => {
    const callUserCreated = jest.spyOn(putUserRepo, 'update');
    await putUserService.execute(userCreated!);

    expect(callUserCreated).toHaveBeenCalledWith({
      ...userCreated,
      password: 'password_encrypted'
    });
  });

  it('Should received an error if encrypted throw a error', () => {
    jest.spyOn(encrypter, 'encrypt').mockResolvedValueOnce('ENCRYPT ERROR');

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new Error('ENCRYPT ERROR'));
  });

  // putUser
  it('should create user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(putUserRepo, 'update');

    await putUserService.execute(userCreated!);

    expect(fnEncrypted).toHaveBeenCalledWith({
      user_id: 'soiltech',
      login: 'soil',
      password: 'password_encrypted',
      user_type: 'SUDO'
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw find user database error, when repository find user return error', () => {
    jest.spyOn(putUserRepo, 'update').mockRejectedValueOnce(new Error());

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw user not exists, if repository not return user', () => {
    jest.spyOn(putUserRepo, 'update').mockResolvedValueOnce(undefined);

    const promise = putUserService.execute(userCreated!);
    expect(promise).rejects.toThrow(new Error('User not update'));
  });

  //Test response useCases

  it('should to user to have  updated', async () => {
    const promise = await putUserService.execute(userCreated!);

    expect(promise).toHaveProperty('user_id', 'soiltech');
    expect(promise).toHaveProperty('user_type', 'SUDO');
    expect(promise).toHaveProperty('login', 'soil');
    expect(promise).toHaveProperty('password', '123456');
  });
});
