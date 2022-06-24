import { IGetAllFarmsRepo, IGetAllUserRepo } from '@root/database/protocols';
import { DatabaseErrorReturn, DataNotFound } from '@root/protocols/errors';
import {
  IGetAllFarmsService,
  IGetAllUserService
} from '@root/useCases/contracts';
import { GetAllFarmsUseCase, GetAllUserUseCase } from '@root/useCases/data';
import { farmsArray } from '@tests/mocks/data/farms/farms-values-mock';
import { usersArray } from '@tests/mocks/data/users/user-values-for-mocks';
import { MockProxy } from 'jest-mock-extended';
import mock from 'jest-mock-extended/lib/Mock';

describe('Get All Users', () => {
  let getAllFarmsRepo: MockProxy<IGetAllFarmsRepo>;
  let getAllFarmsService: IGetAllFarmsService;

  beforeAll(() => {
    getAllFarmsRepo = mock();

    getAllFarmsService = new GetAllFarmsUseCase(getAllFarmsRepo);

    getAllFarmsRepo.getAll.mockResolvedValue(farmsArray);
  });

  it('should execute to have been called a once time and not received params', () => {
    const getExecute = jest.spyOn(getAllFarmsService, 'execute');

    getAllFarmsService.execute();

    expect(getExecute).toHaveBeenCalledTimes(1);
    expect(getExecute).toHaveBeenCalledWith();
  });

  //Tests Get all database repo
  it('should get all users service to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAllFarmsService, 'execute');

    getAllFarmsService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith();
  });

  it('should get all users repo to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAllFarmsRepo, 'getAll');

    getAllFarmsService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith();
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockRejectedValueOnce(new Error());

    const promise = getAllFarmsService.execute();

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received users not found if repo return undefined', () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockResolvedValueOnce(undefined);

    const promise = getAllFarmsService.execute();

    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });

  it('should to received users not found if repo return undefined', async () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockResolvedValueOnce([]);

    const promise = await getAllFarmsService.execute();

    expect(promise).toHaveLength(0);
  });

  // tests return

  it('should to received all users with all data valids', async () => {
    const promise = await getAllFarmsService.execute();

    expect(promise).toBe(farmsArray);
  });
});
