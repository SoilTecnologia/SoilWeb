import '@tests/setup/unit/setup';

import { mock, MockProxy } from 'jest-mock-extended';
import {
  ICreateBaseRepo,
  IGetByIdBaseRepo,
  IUpdateBaseRepo
} from '@database/protocols';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError,
  NotUpdateError
} from '@root/protocols/errors';
import { addScheduling, newScheduling } from '@tests/mocks/data/schedulings';
import { uuidGlobal } from '@tests/mocks/data/global';
import { IUpdateSchedulingService } from '@root/useCases/contracts/scheduling';
import { UpdateSchedulingUseCase } from '@root/useCases/data/Scheduling/UpdateScheduling/UpdateSchedulingUseCase';
import * as mockDate from '@root/utils/convertTimeZoneDate';
import emitter from '@root/utils/eventBus';

jest.mock('@root/utils/convertTimeZoneDate');
jest.mock('@root/utils/eventBus');

describe('Update Scheduling Use Case', () => {
  const data = { ...newScheduling!, update_timestamp: new Date() };
  const myMock = jest.fn();
  let putRepo: MockProxy<IUpdateBaseRepo> = mock();
  let findRepo: MockProxy<IGetByIdBaseRepo> = mock();
  let createRepo: MockProxy<ICreateBaseRepo> = mock();

  let putScheduling: IUpdateSchedulingService;
  const farm_id = addFarms.farm_id;
  let date: Date;

  beforeAll(() => {
    putScheduling = new UpdateSchedulingUseCase(findRepo, putRepo, createRepo);

    findRepo.get.mockResolvedValue(newScheduling);
    putRepo.put.mockResolvedValue(newScheduling);
    createRepo.create.mockResolvedValue({
      ...addScheduling,
      scheduling_history_id: uuidGlobal
    });

    jest.spyOn(mockDate, 'dateIsAter').mockReturnValue(false);
    jest.spyOn(mockDate, 'dateSaoPaulo').mockImplementation(() => {
      date = new Date();
      return date;
    });
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const calFarm = jest.spyOn(putScheduling, 'execute');
    putScheduling.execute(data);

    expect(calFarm).toHaveBeenCalledWith(data);
    expect(calFarm).toBeCalledTimes(1);
  });

  // // Tests created user in database response
  // // find Scheduling
  it('should find scheduling repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findRepo, 'get');

    await putScheduling.execute(data);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'schedulings',
      column: 'scheduling_id',
      id: data.scheduling_id
    });

    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository find farm return error', () => {
    jest.spyOn(findRepo, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    jest.spyOn(findRepo, 'get').mockResolvedValueOnce(undefined);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(new DataNotFound('Scheduling'));
  });

  // // New Farm is equals a old Farm
  it('shoul return scheduling is running if date is after', async () => {
    jest.spyOn(mockDate, 'dateIsAter').mockReturnValueOnce(true);

    const promise = await putScheduling.execute(data);

    expect(promise).toHaveProperty('message', 'scheduling is running');
  });

  //Teste Put Scheduling
  it('should update scheduling repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(putRepo, 'put');

    interface omit
      extends Omit<IUpdateSchedulingService.Params, 'update_timestamp'> {
      update_timestamp?: Date;
    }

    const newData: omit = data;
    delete newData.update_timestamp;

    await putScheduling.execute(data);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'schedulings',
      column: 'scheduling_id',
      where: data.scheduling_id,
      data: {
        ...newData,
        end_timestamp: date,
        start_timestamp: date,
        timestamp: date
      }
    });

    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository find farm return error', () => {
    jest.spyOn(putRepo, 'put').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw farm not exists, if repository not return farm', () => {
    jest.spyOn(putRepo, 'put').mockResolvedValueOnce(undefined);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(new NotUpdateError('Scheduling'));
  });

  // // // Create Schedule History

  it('should update scheduling repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(createRepo, 'create');

    interface omit
      extends Omit<
        IUpdateSchedulingService.Params,
        'update_timestamp' | 'scheduling_id'
      > {
      update_timestamp?: Date;
      scheduling_id?: string;
    }

    const newData: omit = { ...data };
    delete newData.update_timestamp;
    delete newData.scheduling_id;

    await putScheduling.execute(data);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'scheduling_historys',
      data: {
        ...newData,
        updated: data.scheduling_id
      }
    });

    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error, when repository create scheduling history return error', () => {
    jest.spyOn(createRepo, 'create').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw schedule history failed if not created in history', () => {
    jest.spyOn(createRepo, 'create').mockResolvedValueOnce(undefined);

    const promise = putScheduling.execute(data!);
    expect(promise).rejects.toThrow(
      new FailedCreateDataError('SchedulingHistory')
    );
  });

  it('should emitter to have been called', async () => {
    const mockEmit = jest.spyOn(emitter, 'emit');

    await putScheduling.execute(data!);
    expect(mockEmit).toHaveBeenCalledTimes(1);
    expect(mockEmit).toHaveBeenCalledWith('scheduling', {
      scheduling: newScheduling,
      isPut: true
    });
  });

  it('should to have  a data updated', async () => {
    createRepo.create.mockResolvedValueOnce(newScheduling);
    const promise = await putScheduling.execute(data!);

    expect(promise).toHaveProperty('pivot_id');
    expect(promise).toHaveProperty('scheduling_id');
    expect(promise).toHaveProperty('author');
    expect(promise).toHaveProperty('power');
    expect(promise).toHaveProperty('water');
    expect(promise).toHaveProperty('direction');
    expect(promise).toHaveProperty('percentimeter');
    expect(promise).toHaveProperty('start_timestamp');
    expect(promise).toHaveProperty('end_timestamp');
    expect(promise).toHaveProperty('timestamp');
  });
});
