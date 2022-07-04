import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IDeleteSchedulingService } from '@root/useCases/contracts/scheduling';
import { DeleteSchedulingUseCase } from '@root/useCases/data/Scheduling/DeleteScheduling/DeleteSchedulingUseCase';
import { newScheduling } from '@tests/mocks/data/schedulings';
import { mock, MockProxy } from 'jest-mock-extended';

describe('Delete Scheduling Service', () => {
  const scheduling_id = newScheduling.scheduling_id;
  let delRepo: MockProxy<IDeleteBaseRepo>;
  let getById: MockProxy<IGetByIdBaseRepo>;
  let delSchedule: IDeleteSchedulingService;

  beforeAll(() => {
    delRepo = mock();
    getById = mock();

    delSchedule = new DeleteSchedulingUseCase(getById, delRepo);

    getById.get.mockResolvedValue(newScheduling);
    delRepo.del.mockResolvedValue(1);
  });

  it('should execute to have been called with data valids', async () => {
    const service = jest.spyOn(delSchedule, 'execute');

    await delSchedule.execute({ scheduling_id });

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith({ scheduling_id });
  });
  // Teste get by id

  it('should get By Id repo to have been called with data valids', async () => {
    const service = jest.spyOn(getById, 'get');

    await delSchedule.execute({ scheduling_id });

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith({
      table: 'schedulings',
      column: 'scheduling_id',
      id: scheduling_id
    });
  });
  it('should to throw database error if get By Id repo return error', () => {
    jest.spyOn(getById, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = delSchedule.execute({ scheduling_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });
  it('should to throw scheduling not fopund error if get By Id repo not find schedulinge', () => {
    jest.spyOn(getById, 'get').mockResolvedValueOnce(undefined);

    const promise = delSchedule.execute({ scheduling_id });

    expect(promise).rejects.toThrow(new DataNotFound('Scheduling'));
  });

  // Teste del Repo
  it('should get By Id repo to have been called with data valids', async () => {
    const service = jest.spyOn(delRepo, 'del');

    await delSchedule.execute({ scheduling_id });

    expect(service).toHaveBeenCalledTimes(1);
    expect(service).toHaveBeenCalledWith({
      table: 'schedulings',
      column: 'scheduling_id',
      data: scheduling_id
    });
  });
  it('should to throw database error if get By Id repo return error', () => {
    jest.spyOn(delRepo, 'del').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = delSchedule.execute({ scheduling_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });
  it('should return status OK if delete scheduling with sucessfully', async () => {
    jest.spyOn(delRepo, 'del').mockResolvedValueOnce(2);

    const promise = await delSchedule.execute({ scheduling_id });

    expect(promise).toHaveProperty('status', 'OK');
  });
  it('should return status Fail if not delete scheduling', async () => {
    jest.spyOn(delRepo, 'del').mockResolvedValueOnce(undefined);

    const promise = await delSchedule.execute({ scheduling_id });

    expect(promise).toHaveProperty('status', 'FAIL');
  });
});
