import { FarmModel } from '@root/database/model/Farm';
import { IGetAllBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllFarmsService } from '@root/useCases/contracts';
import { GetAllFarmsUseCase } from '@root/useCases/data';
import { farmsArray } from '@tests/mocks/data/farms/farms-values-mock';
import { MockProxy } from 'jest-mock-extended';
import mock from 'jest-mock-extended/lib/Mock';

describe('Get All Users', () => {
  let getAllFarmsRepo: MockProxy<IGetAllBaseRepo>;
  let getAllFarmsService: IGetAllFarmsService;

  beforeAll(() => {
    getAllFarmsRepo = mock();

    getAllFarmsService = new GetAllFarmsUseCase(getAllFarmsRepo);

    getAllFarmsRepo.get.mockResolvedValue(farmsArray);
  });

  it('should execute to have been called a once time and not received params', () => {
    const getExecute = jest.spyOn(getAllFarmsService, 'execute');

    getAllFarmsService.execute();

    expect(getExecute).toHaveBeenCalledTimes(1);
    expect(getExecute).toHaveBeenCalledWith();
  });

  //Tests Get all database repo
  it('should get all farms service to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAllFarmsService, 'execute');

    getAllFarmsService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith();
  });

  it('should get all farms repo to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getAllFarmsRepo, 'get');

    getAllFarmsService.execute();

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith({ table: 'farms' });
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getAllFarmsRepo, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getAllFarmsService.execute();

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received farms not found if repo return undefined', () => {
    jest.spyOn(getAllFarmsRepo, 'get').mockResolvedValueOnce(undefined);

    const promise = getAllFarmsService.execute();

    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });

  it('should to received farms not found if repo return undefined', async () => {
    jest.spyOn(getAllFarmsRepo, 'get').mockResolvedValueOnce([]);

    const promise = await getAllFarmsService.execute();

    expect(promise).toHaveLength(0);
  });

  // tests return

  it('should to received all farms with all data valids', async () => {
    const promise = await getAllFarmsService.execute();

    expect(promise).toBe(farmsArray);
  });
});
