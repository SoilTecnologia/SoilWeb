import '@tests/setup/unit/setup';
import { mock, MockProxy } from 'jest-mock-extended';
import { ICreateFarmUseCase } from '@root/useCases/contracts';
import { CreateFarmUseCase } from '@root/useCases/data';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@root/protocols/errors';
import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { FarmModel } from '@root/database/model/Farm';

describe('Create User Use Case', () => {
  let addfarmRepo: MockProxy<ICreateBaseRepo>;
  let getById: MockProxy<IGetByIdBaseRepo>;

  let createService: ICreateFarmUseCase;

  beforeAll(() => {
    addfarmRepo = mock();
    getById = mock();

    createService = new CreateFarmUseCase(addfarmRepo, getById);

    addfarmRepo.create.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);

    const callUser = jest.spyOn(createService, 'execute');
    createService.execute(addFarms);

    expect(callUser).toHaveBeenCalledWith(addFarms);
    expect(callUser).toBeCalledTimes(1);
  });

  // // Tests find farm by id
  it('should find farm repo to have been called with farm_id received', async () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);
    const fnFarm = jest.spyOn(getById, 'get');

    await createService.execute(addFarms);

    expect(fnFarm).toHaveBeenCalledWith({
      table: 'farms',
      column: 'farm_id',
      id: addFarms.farm_id
    });
    expect(fnFarm).toHaveBeenLastCalledWith({
      table: 'users',
      column: 'user_id',
      id: addFarms.user_id
    });
    expect(fnFarm).toHaveBeenCalledTimes(2);
  });

  it('should to throw database error if find farm repo return error', () => {
    getById.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm already existse error if find farm repo return farm', () => {
    getById.get.mockResolvedValueOnce(addFarms);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new AlreadyExistsError('Farm'));
  });

  //Tests Users

  it('should to throw database error if find user repo return error', () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm already existse error if find farm repo return farm', () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  // Tests create farm

  it('should create farm repo to have been called with farm data received', async () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);

    const fnUser = jest.spyOn(addfarmRepo, 'create');

    await createService.execute(addFarms);

    expect(fnUser).toHaveBeenCalledWith({ table: 'farms', data: addFarms });
    expect(fnUser).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if create farm repo return error', () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);
    jest.spyOn(addfarmRepo, 'create').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm not created if create farm repo return undefined', () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);
    jest.spyOn(addfarmRepo, 'create').mockResolvedValueOnce(undefined);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new FailedCreateDataError('Farm').message);
  });

  // // Test response useCase
  it('should to received a new farm with the data send', async () => {
    getById.get
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(userCreated);

    const promise = await createService.execute(addFarms);

    expect(promise).toHaveProperty('user_id', addFarms?.user_id);
    expect(promise).toHaveProperty('farm_id', addFarms?.farm_id);
    expect(promise).toHaveProperty('farm_name', addFarms?.farm_name);
    expect(promise).toHaveProperty('farm_city', addFarms?.farm_city);
    expect(promise).toHaveProperty('farm_lat', addFarms?.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms?.farm_lng);
  });
});
