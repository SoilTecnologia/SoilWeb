import '@tests/setup/unit/setup';
import { mock, MockProxy } from 'jest-mock-extended';

import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { ICreateBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { ICreateSchedulingService } from '@root/useCases/contracts/scheduling';
import { CreateSchedulingUseCase } from '@root/useCases/data/Scheduling/CreateScheduling/CreateSchedulingUseCase';
import { newPivot } from '@tests/mocks/data/pivots';
import { addScheduling, newScheduling } from '@tests/mocks/data/schedulings';
import { dateSaoPaulo } from '@root/utils/convertTimeZoneDate';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@root/protocols/errors';
import { uuidGlobal } from '@tests/mocks/data/global';

describe('Create User Use Case', () => {
  let addRepo: MockProxy<ICreateBaseRepo>;
  const addNewScheduling = {
    ...addScheduling,
    author: addUser.login
  };

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
  it('should execute to have been called one once time with params valid', async () => {
    const fn = jest.spyOn(createService, 'execute');

    await createService.execute(addNewScheduling);

    expect(fn).toHaveBeenCalledWith(addNewScheduling);

    expect(fn).toBeCalledTimes(1);
  });

  // // Tests find farm by id
  it('should find pivot repo to have been called with farm_id received', async () => {
    const fn = jest.spyOn(getById, 'get');

    await createService.execute(addNewScheduling);

    expect(fn).toHaveBeenCalledWith({
      table: 'pivots',
      column: 'pivot_id',
      id: addNewScheduling.pivot_id
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if find farm repo return error', () => {
    getById.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw farm already existse error if find farm repo return farm', () => {
    getById.get.mockResolvedValueOnce(undefined);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new DataNotFound('Pivot'));
  });

  // //Tests Create Scheduling

  it('should addrepo to have been called 2 once times with table schedulings and scheduling history', async () => {
    const fn = jest.spyOn(addRepo, 'create');

    await createService.execute(addNewScheduling);

    const data = {
      ...addNewScheduling,
      start_timestamp: dateSaoPaulo(addScheduling.start_timestamp!),
      end_timestamp: dateSaoPaulo(addScheduling.end_timestamp!),
      timestamp: dateSaoPaulo(addScheduling.timestamp!)
    };
    expect(fn).toHaveBeenCalledWith({
      table: 'schedulings',
      data
    });
    expect(fn).toHaveBeenCalledWith({
      table: 'scheduling_historys',
      data
    });
    expect(fn).toBeCalledTimes(2);
  });
  it('should power and water to be false if scheduling is_stop', async () => {
    const fn = jest.spyOn(addRepo, 'create');

    await createService.execute({ ...addNewScheduling, is_stop: true });
    const data = {
      ...addNewScheduling,
      is_stop: true,
      percentimeter: 0,
      power: false,
      water: false,
      direction: 'CLOCKWISE',
      start_timestamp: dateSaoPaulo(addScheduling.start_timestamp!),
      end_timestamp: dateSaoPaulo(addScheduling.end_timestamp!),
      timestamp: dateSaoPaulo(addScheduling.timestamp!)
    };

    expect(fn).toHaveBeenCalledWith({
      table: 'schedulings',
      data
    });
    expect(fn).toHaveBeenCalledWith({
      table: 'scheduling_historys',
      data
    });
    expect(fn).toBeCalledTimes(2);
  });

  it('should to throw error if create scheduling repo return farm', () => {
    addRepo.create.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw failed create if create scheduling repo return undefined', () => {
    addRepo.create.mockResolvedValueOnce(undefined);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new FailedCreateDataError('Scheduling'));
  });

  // //Tests Create Scheduling History

  it('should to throw error if create scheduling history repo return farm', () => {
    addRepo.create
      .mockResolvedValueOnce(newScheduling)
      .mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw failed create if create scheduling history repo return undefined', () => {
    addRepo.create
      .mockResolvedValueOnce(newScheduling)
      .mockResolvedValueOnce(undefined);

    const promise = createService.execute(addNewScheduling);

    expect(promise).rejects.toThrow(new FailedCreateDataError('Scheduling'));
  });

  // // // Test response useCase
  it('should to received a new farm with the data send', async () => {
    addRepo.create.mockResolvedValueOnce(newScheduling).mockResolvedValueOnce({
      ...addNewScheduling,
      scheduling_history_id: uuidGlobal
    });

    const promise = await createService.execute(addNewScheduling);

    expect(promise).toHaveProperty('pivot_id', addNewScheduling.pivot_id);
    expect(promise).toHaveProperty('scheduling_id');
    expect(promise).toHaveProperty('is_stop', addNewScheduling.is_stop);
    expect(promise).toHaveProperty('power', addNewScheduling.power);
    expect(promise).toHaveProperty('direction', addNewScheduling.direction);
    expect(promise).toHaveProperty('water', addNewScheduling.water);
    expect(promise).toHaveProperty(
      'percentimeter',
      addNewScheduling.percentimeter
    );
    expect(promise).toHaveProperty(
      'start_timestamp',
      addNewScheduling.start_timestamp
    );
    expect(promise).toHaveProperty(
      'end_timestamp',
      addNewScheduling.end_timestamp
    );
    expect(promise).toHaveProperty('timestamp', addNewScheduling.timestamp);
  });
});
