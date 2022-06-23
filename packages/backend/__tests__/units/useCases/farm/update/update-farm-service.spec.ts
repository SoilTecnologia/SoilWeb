import { mock, MockProxy } from 'jest-mock-extended';
import {
  IUpdateFarmRepo,
  IFindFarmByIdRepo,
  IFindUserByIdRepo
} from '@database/protocols';
import { IUpdateFarmService } from '@root/useCases/contracts';
import { UpdateFarmUseCase } from '@root/useCases/data';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import {
  DatabaseErrorReturn,
  DataNotFound,
  NotUpdateError
} from '@root/protocols/errors';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';

describe('Update Farm Use Case', () => {
  let putFarmRepo: MockProxy<IUpdateFarmRepo>;
  let findFarmRepo: MockProxy<IFindFarmByIdRepo>;
  let findUser: MockProxy<IFindUserByIdRepo>;

  let putFarmService: IUpdateFarmService;
  const farm_id = addFarms.farm_id;

  beforeEach(() => {
    putFarmRepo = mock();
    findFarmRepo = mock();
    findUser = mock();

    putFarmService = new UpdateFarmUseCase(findFarmRepo, putFarmRepo, findUser);

    findFarmRepo.find.mockResolvedValue({ ...addFarms, farm_name: 'new_soil' });
    putFarmRepo.update.mockResolvedValue(addFarms);
    findUser.findById.mockResolvedValue(userCreated);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const calFarm = jest.spyOn(putFarmService, 'execute');
    putFarmService.execute(addFarms!);

    expect(calFarm).toHaveBeenCalledWith(addFarms);
    expect(calFarm).toBeCalledTimes(1);
  });

  // // Tests created user in database response
  // // findFarm
  it('should find farm repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findFarmRepo, 'find');

    await putFarmService.execute(addFarms!);

    expect(fnEncrypted).toHaveBeenCalledWith({ farm_id });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository find farm return error', () => {
    jest.spyOn(findFarmRepo, 'find').mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    jest.spyOn(findFarmRepo, 'find').mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });
  // New Farm is equals a old Farm
  it('shoul error if a farm ewceived is equals a old farm', () => {
    findFarmRepo.find.mockResolvedValueOnce(addFarms);

    const promise = putFarmService.execute(addFarms);

    expect(promise).rejects.toThrow(
      new Error('New Farm is Strict Equals a Old Farms, Not Updated...')
    );
  });

  // Find User
  it('should find user repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findUser, 'findById');

    await putFarmService.execute(addFarms!);

    expect(fnEncrypted).toHaveBeenCalledWith({ id: addFarms.user_id });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository find user return error', () => {
    jest.spyOn(findUser, 'findById').mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw user not exists, if repository not return farm', () => {
    jest.spyOn(findUser, 'findById').mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  // // putUser
  it('should update farm repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(putFarmRepo, 'update');

    await putFarmService.execute(addFarms!);

    expect(fnEncrypted).toHaveBeenCalledWith(addFarms);
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository update farm return error', () => {
    jest.spyOn(putFarmRepo, 'update').mockRejectedValueOnce(new Error());

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    jest.spyOn(putFarmRepo, 'update').mockResolvedValueOnce(undefined);

    const promise = putFarmService.execute(addFarms!);
    expect(promise).rejects.toThrow(new NotUpdateError('Farm'));
  });

  // //Test response useCases

  it('should to farm to have  updated', async () => {
    const promise = await putFarmService.execute(addFarms!);

    expect(promise).toHaveProperty('user_id', addFarms.user_id);
    expect(promise).toHaveProperty('farm_id', farm_id);
    expect(promise).toHaveProperty('farm_city', addFarms.farm_city);
    expect(promise).toHaveProperty('farm_name', addFarms.farm_name);
    expect(promise).toHaveProperty('farm_lat', addFarms.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms.farm_lng);
  });
});
