import { mock, MockProxy } from 'jest-mock-extended';

import { IFindFarmByIdRepo } from '@root/database/protocols';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { GetOneFarmUseCase } from '@root/useCases/data';
import { DatabaseErrorReturn } from '@root/protocols/errors';
import { IGetOneFarmService } from '@root/useCases/contracts';

describe('Find Farm By Id Use Case', () => {
  let findFarmRepo: MockProxy<IFindFarmByIdRepo>;
  const { farm_id } = addFarms;

  let findService: IGetOneFarmService;

  beforeAll(() => {
    findFarmRepo = mock();

    findService = new GetOneFarmUseCase(findFarmRepo);

    findFarmRepo.find.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(findService, 'execute');
    findService.execute({ farm_id });

    expect(callUser).toHaveBeenCalledWith({ farm_id: addFarms.farm_id });
    expect(callUser).toBeCalledTimes(1);
  });

  // Tests find farm by id
  it('should find farm repo to have been called with farm_id received', async () => {
    const fnFarm = jest.spyOn(findFarmRepo, 'find');

    await findService.execute({ farm_id });

    expect(fnFarm).toHaveBeenCalledWith({ farm_id: addFarms.farm_id });
    expect(fnFarm).toHaveBeenCalledTimes(1);
  });

  it('should to throw database error if find farm repo return error', () => {
    jest
      .spyOn(findFarmRepo, 'find')
      .mockRejectedValueOnce(new DatabaseErrorReturn());

    const promise = findService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to return undefined if find farm repo return undefined', async () => {
    jest.spyOn(findFarmRepo, 'find').mockResolvedValueOnce(undefined);

    const promise = await findService.execute({ farm_id });

    expect(promise).toBeUndefined();
  });

  // Test response useCase
  it('should to received a  farm with the data send', async () => {
    const promise = await findService.execute({ farm_id });

    expect(promise).toHaveProperty('user_id', addFarms?.user_id);
    expect(promise).toHaveProperty('farm_id', farm_id);
    expect(promise).toHaveProperty('farm_name', addFarms?.farm_name);
    expect(promise).toHaveProperty('farm_city', addFarms?.farm_city);
    expect(promise).toHaveProperty('farm_lat', addFarms?.farm_lat);
    expect(promise).toHaveProperty('farm_lng', addFarms?.farm_lng);
  });
});
