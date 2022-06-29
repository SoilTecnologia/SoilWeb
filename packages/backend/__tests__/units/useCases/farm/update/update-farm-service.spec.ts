import { mock, MockProxy } from 'jest-mock-extended';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@database/protocols';
import { IUpdateFarmService } from '@root/useCases/contracts';
import { UpdateFarmUseCase } from '@root/useCases/data';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import {
  DatabaseErrorReturn,
  DataNotFound,
  NotUpdateError
} from '@root/protocols/errors';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { FarmModel } from '@root/database/model/Farm';

describe('Update Farm Use Case', () => {
  let putFarmRepo: MockProxy<IUpdateBaseRepo<FarmModel>>;
  let findFarmRepo: MockProxy<IGetByIdBaseRepo>;

  let putFarmService: IUpdateFarmService;
  const farm_id = addFarms.farm_id;

  beforeEach(() => {
    putFarmRepo = mock();
    findFarmRepo = mock();

    putFarmService = new UpdateFarmUseCase(findFarmRepo, putFarmRepo);

    putFarmRepo.put.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);
    const calFarm = jest.spyOn(putFarmService, 'execute');
    putFarmService.execute(addFarms!);

    expect(calFarm).toHaveBeenCalledWith(addFarms);
    expect(calFarm).toBeCalledTimes(1);
  });

  // // Tests created user in database response
  // // findFarm
  it('should find farm repository to have been called with data valids to have called once time', async () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);

    const fnEncrypted = jest.spyOn(findFarmRepo, 'get');

    await putFarmService.execute(addFarms!);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'farms',
      column: 'farm_id',
      id: addFarms.farm_id
    });
    expect(fnEncrypted).toHaveBeenLastCalledWith({
      table: 'users',
      column: 'user_id',
      id: addFarms.user_id
    });
    expect(fnEncrypted).toBeCalledTimes(2);
  });

  it('should throw database error, when repository find farm return error', () => {
    jest.spyOn(findFarmRepo, 'get').mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    jest.spyOn(findFarmRepo, 'get').mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });
  // New Farm is equals a old Farm
  it('shoul error if a farm ewceived is equals a old farm', () => {
    findFarmRepo.get.mockResolvedValueOnce(addFarms);

    const promise = putFarmService.execute(addFarms);

    expect(promise).rejects.toThrow(
      new Error('New Farm is Strict Equals a Old Farms, Not Updated...')
    );
  });

  // // Find User

  it('should throw database error, when repository find user return error', () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw user not exists, if repository not return farm', () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  // // // putUser
  it('should update farm repository to have been called with data valids to have called once time', async () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);

    const fnEncrypted = jest.spyOn(putFarmRepo, 'put');

    await putFarmService.execute(addFarms!);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'farms',
      column: 'farm_id',
      where: addFarms.farm_id,
      data: addFarms
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository update farm return error', () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);
    jest.spyOn(putFarmRepo, 'put').mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);
    jest.spyOn(putFarmRepo, 'put').mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new NotUpdateError('Farm'));
  });

  // // //Test response useCases

  it('should to farm to have  updated', async () => {
    findFarmRepo.get
      .mockResolvedValueOnce({ ...addFarms, farm_name: 'new_soil' })
      .mockResolvedValueOnce(userCreated);
    const promise = await putFarmService.execute(addFarms!);

    expect(promise).toHaveProperty('user_id', addFarms.user_id);
    expect(promise).toHaveProperty('farm_id', farm_id);
    expect(promise).toHaveProperty('farm_city', addFarms.farm_city);
    expect(promise).toHaveProperty('farm_name', addFarms.farm_name);
    expect(promise).toHaveProperty('farm_lat', addFarms.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms.farm_lng);
  });
});
