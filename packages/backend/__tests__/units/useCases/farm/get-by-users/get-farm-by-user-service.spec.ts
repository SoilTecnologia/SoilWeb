import { UserModel } from '@root/database/model/User';
import {
  IGetByIdBaseRepo,
  IGetFarmByUserIdRepo
} from '@root/database/protocols';
import { DatabaseErrorReturn, DataNotFound } from '@root/protocols/errors';
import { IGetFarmByUserService } from '@root/useCases/contracts/farms/get-by-user';
import { GetFarmByUserUseCase } from '@root/useCases/data';
import { farmsArray } from '@tests/mocks/data/farms/farms-values-mock';
import { uuidGlobal } from '@tests/mocks/data/global';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { MockProxy } from 'jest-mock-extended';
import mock from 'jest-mock-extended/lib/Mock';

describe('Get All Users', () => {
  let getAllFarmsRepo: MockProxy<IGetFarmByUserIdRepo>;
  let getUser: MockProxy<IGetByIdBaseRepo<UserModel>>;
  let getAllFarmsService: IGetFarmByUserService;
  const user_id = uuidGlobal;

  beforeAll(() => {
    getAllFarmsRepo = mock();
    getUser = mock();

    getAllFarmsService = new GetFarmByUserUseCase(getAllFarmsRepo, getUser);

    getUser.get.mockResolvedValue(userCreated);
    getAllFarmsRepo.getAll.mockResolvedValue(farmsArray);
  });

  it('should execute to have been called a once time and not received params', () => {
    const getExecute = jest.spyOn(getAllFarmsService, 'execute');

    getAllFarmsService.execute({ user_id });

    expect(getExecute).toHaveBeenCalledTimes(1);
    expect(getExecute).toHaveBeenCalledWith({ user_id });
  });

  //Tests Get all database repo
  //Find User
  it('should get user repo to have been called with params correctly', () => {
    const fnGetAll = jest.spyOn(getUser, 'get');

    getAllFarmsService.execute({ user_id });

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith({
      table: 'users',
      column: 'user_id',
      id: user_id
    });
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getUser, 'get').mockRejectedValueOnce(new Error());

    const promise = getAllFarmsService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received users not found if repo return undefined', () => {
    jest.spyOn(getUser, 'get').mockResolvedValueOnce(undefined);

    const promise = getAllFarmsService.execute({ user_id });

    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  //Get Farms
  it('should get all users repo to have been called with params correctly', async () => {
    const fnGetAll = jest.spyOn(getAllFarmsRepo, 'getAll');

    await getAllFarmsService.execute({ user_id });

    expect(fnGetAll).toHaveBeenCalledTimes(1);
    expect(fnGetAll).toHaveBeenCalledWith({ user_id });
  });

  it('should to have database error if repo return error', () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockRejectedValueOnce(new Error());

    const promise = getAllFarmsService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to received users not found if repo return undefined', () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockResolvedValueOnce(undefined);

    const promise = getAllFarmsService.execute({ user_id });

    expect(promise).rejects.toThrow(new DataNotFound('Farms'));
  });

  it('should to received farms empty if repo return array empty', async () => {
    jest.spyOn(getAllFarmsRepo, 'getAll').mockResolvedValueOnce([]);

    const promise = await getAllFarmsService.execute({ user_id });

    expect(promise).toHaveLength(0);
  });

  // // tests return

  it('should to received all users with all data valids', async () => {
    const promise = await getAllFarmsService.execute({ user_id });

    expect(promise).toBe(farmsArray);
  });
});
