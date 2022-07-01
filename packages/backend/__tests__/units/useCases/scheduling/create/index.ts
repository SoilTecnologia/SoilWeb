import { mock, MockProxy } from 'jest-mock-extended';

import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { ICreateSchedulingService } from '@root/useCases/contracts/scheduling';
import { CreateSchedulingUseCase } from '@root/useCases/data/Scheduling/CreateScheduling/CreateSchedulingUseCase';
import { newPivot } from '@tests/mocks/data/pivots';
import { addScheduling, newScheduling } from '@tests/mocks/data/schedulings';

describe('Create User Use Case', () => {
  let addRepo: MockProxy<ICreateBaseRepo>;

  let getById: MockProxy<IGetByIdBaseRepo>;

  let createService: ICreateSchedulingService;

  beforeAll(() => {
    addRepo = mock();
    getById = mock();

    createService = new CreateSchedulingUseCase(getById, addRepo);

    addRepo.create.mockResolvedValue(addFarms);
    getById.get.mockResolvedValue(newPivot);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    addRepo.create
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(newScheduling);

    const callUser = jest.spyOn(createService, 'execute');
    createService.execute({ ...addScheduling, author: addUser.login });

    expect(callUser).toHaveBeenCalledWith({
      ...addScheduling,
      author: addUser.login
    });
    expect(callUser).toBeCalledTimes(1);
  });

  // // Tests find farm by id
  // it('should find farm repo to have been called with farm_id received', async () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(userCreated);
  //   const fnFarm = jest.spyOn(getById, 'get');

  //   await createService.execute(addFarms);

  //   expect(fnFarm).toHaveBeenCalledWith({
  //     table: 'farms',
  //     column: 'farm_id',
  //     id: addFarms.farm_id
  //   });
  //   expect(fnFarm).toHaveBeenLastCalledWith({
  //     table: 'users',
  //     column: 'user_id',
  //     id: addFarms.user_id
  //   });
  //   expect(fnFarm).toHaveBeenCalledTimes(2);
  // });

  // it('should to throw database error if find farm repo return error', () => {
  //   getById.get.mockRejectedValueOnce(new Error());

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  // });

  // it('should to throw farm already existse error if find farm repo return farm', () => {
  //   getById.get.mockResolvedValueOnce(addFarms);

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new AlreadyExistsError('Farm'));
  // });

  // //Tests Users

  // it('should to throw database error if find user repo return error', () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockRejectedValueOnce(new Error());

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  // });

  // it('should to throw farm already existse error if find farm repo return farm', () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(undefined);

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new DataNotFound('User'));
  // });

  // // Tests create farm

  // it('should create farm repo to have been called with farm data received', async () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(userCreated);

  //   const fnUser = jest.spyOn(addfarmRepo, 'create');

  //   await createService.execute(addFarms);

  //   expect(fnUser).toHaveBeenCalledWith({ table: 'farms', data: addFarms });
  //   expect(fnUser).toHaveBeenCalledTimes(1);
  // });

  // it('should to throw database error if create farm repo return error', () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(userCreated);
  //   jest
  //     .spyOn(addfarmRepo, 'create')
  //     .mockRejectedValueOnce(new DatabaseErrorReturn());

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  // });

  // it('should to throw farm not created if create farm repo return undefined', () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(userCreated);
  //   jest.spyOn(addfarmRepo, 'create').mockResolvedValueOnce(undefined);

  //   const promise = createService.execute(addFarms);

  //   expect(promise).rejects.toThrow(new FailedCreateDataError('Farm').message);
  // });

  // // // Test response useCase
  // it('should to received a new farm with the data send', async () => {
  //   getById.get
  //     .mockResolvedValueOnce(undefined)
  //     .mockResolvedValueOnce(userCreated);

  //   const promise = await createService.execute(addFarms);

  //   expect(promise).toHaveProperty('user_id', addFarms?.user_id);
  //   expect(promise).toHaveProperty('farm_id', addFarms?.farm_id);
  //   expect(promise).toHaveProperty('farm_name', addFarms?.farm_name);
  //   expect(promise).toHaveProperty('farm_city', addFarms?.farm_city);
  //   expect(promise).toHaveProperty('farm_lat', addFarms?.farm_lat);
  //   expect(promise).toHaveProperty('farm_lng', addFarms?.farm_lng);
  // });
});
