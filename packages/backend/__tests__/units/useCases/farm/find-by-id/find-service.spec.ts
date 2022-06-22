import { mock, MockProxy } from 'jest-mock-extended';

import { IFindFarmByIdRepo } from '@root/database/protocols/farms/find-by-farm_id/find';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { GetOneFarmUseCase } from '@root/useCases/data/Farms/GetOneFarm/GetOneFarmsuseCase';
import { DatabaseErrorReturn } from '@root/protocols/errors';

describe('Find Farm By Id Use Case', () => {
  let findFarmRepo: MockProxy<IFindFarmByIdRepo>;

  let findService: GetOneFarmUseCase;

  beforeAll(() => {
    findFarmRepo = mock();

    findService = new GetOneFarmUseCase(findFarmRepo);

    findFarmRepo.find.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(findService, 'execute');
    findService.execute(addFarms.farm_id);

    expect(callUser).toHaveBeenCalledWith(addFarms.farm_id);
    expect(callUser).toBeCalledTimes(1);
  });

  // Tests find farm by id
  it('should find farm repo to have been called with farm_id received', async () => {
    const fnFarm = jest.spyOn(findFarmRepo, 'find');

    await findService.execute(addFarms.farm_id);

    expect(fnFarm).toHaveBeenCalledWith({ farm_id: addFarms.farm_id });
    expect(fnFarm).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if find farm repo return error', () => {
    jest
      .spyOn(findFarmRepo, 'find')
      .mockRejectedValueOnce(new DatabaseErrorReturn());

    const promise = findService.execute(addFarms.farm_id);

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to return undefined if find farm repo return undefined', async () => {
    jest.spyOn(findFarmRepo, 'find').mockResolvedValueOnce(undefined);

    const promise = await findService.execute(addFarms.farm_id);

    expect(promise).toBe(undefined);
    expect(promise).not.toHaveProperty('user_id', addFarms?.user_id);
    expect(promise).not.toHaveProperty('farm_id', addFarms?.farm_id);
    expect(promise).not.toHaveProperty('farm_name', addFarms?.farm_name);
    expect(promise).not.toHaveProperty('farm_city', addFarms?.farm_city);
    expect(promise).not.toHaveProperty('farm_lat', addFarms?.farm_lat);
    expect(promise).not.toHaveProperty('farm_lng', addFarms?.farm_lng);
  });

  // Test response useCase
  it('should to received a  farm with the data send', async () => {
    const promise = await findService.execute(addFarms.farm_id);

    expect(promise).toHaveProperty('user_id', addFarms?.user_id);
    expect(promise).toHaveProperty('farm_id', addFarms?.farm_id);
    expect(promise).toHaveProperty('farm_name', addFarms?.farm_name);
    expect(promise).toHaveProperty('farm_city', addFarms?.farm_city);
    expect(promise).toHaveProperty('farm_lat', addFarms?.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms?.farm_lng);
  });
});
