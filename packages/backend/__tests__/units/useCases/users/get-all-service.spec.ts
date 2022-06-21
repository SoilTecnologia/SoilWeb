import { IGetAllUserRepo } from '@root/database/protocols/users/get-all/IGetAllUserRepo';
import { DatabaseErrorReturn } from '@root/protocols/errors';
import { IGetAllUserService } from '@root/useCases/contracts/users/get-all-user/get-all-user';
import { GetAllUserUseCase } from '@root/useCases/data/User/GetAllUsers/GetAllUserUseCase';
import { usersArray } from '@tests/mocks/data/users/user-values-for-mocks';
import { MockProxy } from 'jest-mock-extended';
import mock from 'jest-mock-extended/lib/Mock';

describe('Get All Users', () => {
  let getAllUserRepo: MockProxy<IGetAllUserRepo>;
  let getAllUserService: IGetAllUserService;

  beforeAll(() => {
    getAllUserRepo = mock();

    getAllUserService = new GetAllUserUseCase(getAllUserRepo);

    getAllUserRepo.getAll.mockResolvedValue(usersArray);
  });

  it('should execute to have been called a once time and not received params', () => {
    const getExecute = jest.spyOn(getAllUserService, 'execute');

    getAllUserService.execute();

    expect(getExecute).toHaveBeenCalledTimes(1);
    expect(getExecute).toHaveBeenCalledWith();
  });

  //Tests Get all database repo

  it('should get all users repo to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAllUserRepo, 'getAll');

    getAllUserService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith();
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getAllUserRepo, 'getAll').mockRejectedValueOnce(new Error());

    const promise = getAllUserService.execute();

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received users not found if repo return undefined', () => {
    jest.spyOn(getAllUserRepo, 'getAll').mockResolvedValueOnce(undefined);

    const promise = getAllUserService.execute();

    expect(promise).rejects.toThrow(new Error('No user found'));
  });

  // tests return

  it('should to received all users with all data valids', async () => {
    const promise = await getAllUserService.execute();

    expect(promise).toBe(usersArray);
  });
});
