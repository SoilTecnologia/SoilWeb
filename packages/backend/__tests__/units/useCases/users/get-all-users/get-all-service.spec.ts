import '@tests/setup/unit/setup';

import { IGetAllBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllUserService } from '@root/useCases/contracts';
import { GetAllUserUseCase } from '@root/useCases/data';
import { usersArray } from '@tests/mocks/data/users/user-values-for-mocks';
import { MockProxy } from 'jest-mock-extended';
import mock from 'jest-mock-extended/lib/Mock';

describe('Get All Users', () => {
  let getAll: MockProxy<IGetAllBaseRepo>;
  let getAllUserService: IGetAllUserService;

  beforeAll(() => {
    getAll = mock();

    getAllUserService = new GetAllUserUseCase(getAll);

    getAll.get.mockResolvedValue(usersArray);
  });

  it('should execute to have been called a once time and not received params', () => {
    const getExecute = jest.spyOn(getAllUserService, 'execute');

    getAllUserService.execute();

    expect(getExecute).toHaveBeenCalledTimes(1);
    expect(getExecute).toHaveBeenCalledWith();
  });

  //Tests Get all database repo

  it('should get all users repo to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAll, 'get');

    getAllUserService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith({ table: 'users' });
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getAllUserService.execute();

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received users not found if repo return undefined', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(undefined);

    const promise = getAllUserService.execute();

    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  // tests return

  it('should to received all users with all data valids', async () => {
    const promise = await getAllUserService.execute();

    expect(promise).toBe(usersArray);
  });
});
