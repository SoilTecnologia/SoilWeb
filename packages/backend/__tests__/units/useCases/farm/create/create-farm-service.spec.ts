import { mock, MockProxy } from 'jest-mock-extended';

import { IFindUserByIdRepo } from '@database/protocols/users';
import { IFindFarmByIdRepo } from '@root/database/protocols/farms/find-by-farm_id/find';
import { ICreateFarmRepo } from '@root/database/protocols/farms/create-farms/create-farms-protocol';
import { ICreateFarmUseCase } from '@root/useCases/contracts/farms/create/create-farm-protocol';
import { CreateFarmUseCase } from '@root/useCases/data/Farms/CreateFarms/CreateFarmUseCase';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { DatabaseErrorReturn } from '@root/protocols/errors';

describe('Create User Use Case', () => {
  let addfarmRepo: MockProxy<ICreateFarmRepo>;
  let findFarmRepo: MockProxy<IFindFarmByIdRepo>;
  let findUserRepo: MockProxy<IFindUserByIdRepo>;

  let createService: ICreateFarmUseCase;

  beforeAll(() => {
    addfarmRepo = mock();
    findFarmRepo = mock();
    findUserRepo = mock();

    createService = new CreateFarmUseCase(
      addfarmRepo,
      findFarmRepo,
      findUserRepo
    );

    findUserRepo.findById.mockResolvedValue(userCreated);
    findFarmRepo.find.mockResolvedValue(undefined);
    addfarmRepo.create.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(createService, 'execute');
    createService.execute(addFarms);

    expect(callUser).toHaveBeenCalledWith(addFarms);
    expect(callUser).toBeCalledTimes(1);
  });

  // Tests find farm by id
  it('should find farm repo to have been called with farm_id received', async () => {
    const fnFarm = jest.spyOn(findFarmRepo, 'find');

    await createService.execute(addFarms);

    expect(fnFarm).toHaveBeenCalledWith({ farm_id: addFarms.farm_id });
    expect(fnFarm).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if find farm repo return error', () => {
    jest
      .spyOn(findFarmRepo, 'find')
      .mockRejectedValueOnce(new DatabaseErrorReturn());

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm already existse error if find farm repo return farm', () => {
    jest.spyOn(findFarmRepo, 'find').mockResolvedValueOnce(addFarms);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new Error('Farm Already Exists'));
  });

  //Tests find user by id
  it('should find user repo to have been called with user_id received', async () => {
    const fnUser = jest.spyOn(findUserRepo, 'findById');

    await createService.execute(addFarms);

    expect(fnUser).toHaveBeenCalledWith({ id: addFarms.user_id });
    expect(fnUser).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if find user repo return error', () => {
    jest
      .spyOn(findUserRepo, 'findById')
      .mockRejectedValueOnce(new DatabaseErrorReturn());

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw user not exists error if find user repo return undefined', () => {
    jest.spyOn(findUserRepo, 'findById').mockResolvedValueOnce(undefined);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new Error('User does not exists'));
  });

  // Tests create farm

  it('should create farm repo to have been called with farm data received', async () => {
    const fnUser = jest.spyOn(addfarmRepo, 'create');

    await createService.execute(addFarms);

    expect(fnUser).toHaveBeenCalledWith(addFarms);
    expect(fnUser).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if create farm repo return error', () => {
    jest
      .spyOn(addfarmRepo, 'create')
      .mockRejectedValueOnce(new DatabaseErrorReturn());

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm not created if create farm repo return undefined', () => {
    jest.spyOn(addfarmRepo, 'create').mockResolvedValueOnce(undefined);

    const promise = createService.execute(addFarms);

    expect(promise).rejects.toThrow(new Error('Does not created Farm'));
  });

  // Test response useCase
  it('should to received a new farm with the data send', async () => {
    const promise = await createService.execute(addFarms);

    expect(promise).toHaveProperty('user_id', addFarms?.user_id);
    expect(promise).toHaveProperty('farm_id', addFarms?.farm_id);
    expect(promise).toHaveProperty('farm_name', addFarms?.farm_name);
    expect(promise).toHaveProperty('farm_city', addFarms?.farm_city);
    expect(promise).toHaveProperty('farm_lat', addFarms?.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms?.farm_lng);
  });
});
