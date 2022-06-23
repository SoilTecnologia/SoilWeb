import '@root/shared/container/index';
import { IDeleteFarmRepo, IFindFarmByIdRepo } from '@root/database/protocols';
import { mock, MockProxy } from 'jest-mock-extended';
import { IDeleteFarmService } from '@root/useCases/contracts';
import { DeleteFarmUseCase } from '@root/useCases/data';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { DatabaseErrorReturn, DataNotFound } from '@root/protocols/errors';

describe('Delete Farm Service', () => {
  let findFarm: MockProxy<IFindFarmByIdRepo>;
  let delFarm: MockProxy<IDeleteFarmRepo>;
  let deleteFarmService: IDeleteFarmService;
  const farm_id = 'soil_farm';

  beforeAll(async () => {
    findFarm = mock();
    delFarm = mock();

    deleteFarmService = new DeleteFarmUseCase(findFarm, delFarm);

    findFarm.find.mockResolvedValue(addFarms);
    delFarm.delete.mockResolvedValue(1);
  });

  // Teste params received
  it('should delete farm usecase to have been calles with params correctly ', () => {
    const spyService = jest.spyOn(deleteFarmService, 'execute');

    deleteFarmService.execute({ farm_id });

    expect(spyService).toHaveBeenCalledWith({ farm_id });
  });

  // Tests return databse

  it('should findFarm to have been called with params correctly ', async () => {
    const fnfindFarm = jest.spyOn(findFarm, 'find');

    await deleteFarmService.execute({ farm_id });

    expect(fnfindFarm).toHaveBeenCalledWith({ farm_id });
  });

  it('should return error if not exists farm in database ', () => {
    jest.spyOn(findFarm, 'find').mockResolvedValueOnce(undefined);

    const promise = deleteFarmService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });

  it('should return error if database return a error ', () => {
    jest.spyOn(findFarm, 'find').mockRejectedValueOnce(new Error(''));

    const promise = deleteFarmService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // //Tests return Database Deletefarm

  it('should findFarm to have been called with params correctly ', async () => {
    const fndelFarm = jest.spyOn(delFarm, 'delete');

    await deleteFarmService.execute({ farm_id });

    expect(fndelFarm).toHaveBeenCalledWith({ farm_id });
  });

  it('should return error if delete user database return a error ', () => {
    jest.spyOn(delFarm, 'delete').mockRejectedValueOnce(new Error(''));

    const promise = deleteFarmService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // // Return final

  it('should return error if not response delete farm ', async () => {
    jest.spyOn(delFarm, 'delete').mockResolvedValueOnce(undefined);

    const promise = await deleteFarmService.execute({ farm_id });

    expect(promise).toHaveProperty('status', 'FAIL');
  });

  it('should return status ok if farm deleted with sucessfully ', async () => {
    const promise = await deleteFarmService.execute({ farm_id });

    expect(promise).toHaveProperty('status', 'OK');
  });
});
