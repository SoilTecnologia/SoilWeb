import { IGetAllBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetAllSchedulingService } from '@root/useCases/contracts/scheduling';
import { GetAllSchedulingUseCase } from '@root/useCases/data/Scheduling/GetAllScheduling/GetAllSchedulingUseCase';
import { newScheduling } from '@tests/mocks/data/schedulings';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Get All Schedulings Services', () => {
  let getAll: MockProxy<IGetAllBaseRepo>;
  let service: IGetAllSchedulingService;

  beforeAll(() => {
    getAll = mock();

    service = new GetAllSchedulingUseCase(getAll);

    getAll.get.mockResolvedValue([newScheduling, newScheduling]);
  });
  it(' should execute to have been called with data valids', async () => {
    const fn = jest.spyOn(service, 'execute');

    await service.execute();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith();
  });

  //Tests Get all Repo
  it(' should to rhow database error if get all return message error', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const fn = service.execute();
    expect(fn).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw data not found if get all return undefined', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(undefined);

    const fn = service.execute();
    expect(fn).rejects.toThrow(new DataNotFound('Scheduling'));
  });
  it('should response to have list empty if not exists schedules', async () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce([]);
    const fn = await service.execute();
    expect(fn).toHaveLength(0);
  });
  it('should response to have list of the schedulings', async () => {
    const fn = await service.execute();
    expect(fn).toHaveLength(2);
    expect(fn![0]).toHaveProperty('scheduling_id');
  });
});
