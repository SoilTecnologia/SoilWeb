import {
  IGetAllByDataBaseRepo,
  IGetByIdBaseRepo
} from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IGetSchedulingByPivotService } from '@root/useCases/contracts/scheduling/get-by-pivot';
import { GetSchedulingUseCase } from '@root/useCases/data/Scheduling/GetScheduling/GetSchedulingUseCase';
import { newPivot } from '@tests/mocks/data/pivots';
import { newScheduling } from '@tests/mocks/data/schedulings';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Get All Schedulings Services', () => {
  const pivot_id = newScheduling.pivot_id;
  let getById: MockProxy<IGetByIdBaseRepo>;
  let getAll: MockProxy<IGetAllByDataBaseRepo>;
  let service: IGetSchedulingByPivotService;

  beforeAll(() => {
    getAll = mock();
    getById = mock();

    service = new GetSchedulingUseCase(getById, getAll);

    getById.get.mockResolvedValue(newPivot);
    getAll.get.mockResolvedValue([newScheduling, newScheduling]);
  });
  it(' should execute to have been called with data valids', async () => {
    const fn = jest.spyOn(service, 'execute');

    await service.execute({ pivot_id });
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({ pivot_id });
  });

  //Test Get By Id
  it(' should get by id repo to have been called with data valids', async () => {
    const fn = jest.spyOn(getById, 'get');

    await service.execute({ pivot_id });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith({
      table: 'pivots',
      column: 'pivot_id',
      id: pivot_id
    });
  });

  it(' should to trhow database error if get all return message error', () => {
    jest.spyOn(getById, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const fn = service.execute({ pivot_id });
    expect(fn).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw data not found if get all return undefined', () => {
    jest.spyOn(getById, 'get').mockResolvedValueOnce(undefined);

    const fn = service.execute({ pivot_id });
    expect(fn).rejects.toThrow(new DataNotFound('Pivot'));
  });

  //Tests Get all Repo
  it(' should to rhow database error if get all return message error', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const fn = service.execute({ pivot_id });
    expect(fn).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw data not found if get all return undefined', () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce(undefined);

    const fn = service.execute({ pivot_id });
    expect(fn).rejects.toThrow(new DataNotFound('Schedulings'));
  });
  it('should response to have list empty if not exists schedules', async () => {
    jest.spyOn(getAll, 'get').mockResolvedValueOnce([]);
    const fn = await service.execute({ pivot_id });
    expect(fn).toHaveLength(0);
  });

  it('should response to have list of the schedulings', async () => {
    const fn = await service.execute({ pivot_id });
    expect(fn).toHaveLength(2);
    expect(fn![0]).toHaveProperty('scheduling_id');
  });
});
