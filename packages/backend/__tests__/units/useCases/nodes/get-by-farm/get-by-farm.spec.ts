import 'reflect-metadata';
import '@tests/setup/unit/setup';
import { mock, MockProxy } from 'jest-mock-extended';
import { IGetAllByDataBaseRepo, IGetByIdBaseRepo } from '@database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@protocols/errors';
import { arrayNode } from '@tests/mocks/data/node';
import { IGetAllByFarmService } from '@root/useCases/contracts';
import { GetAllByFarmIdUseCase } from '@root/useCases/data';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

describe('Update Node Service', () => {
  let findAllNode: MockProxy<IGetAllByDataBaseRepo>;
  let findNode: MockProxy<IGetByIdBaseRepo>;
  const farm_id = 'soiltech';

  let getService: IGetAllByFarmService;

  beforeEach(() => {
    findAllNode = mock();
    findNode = mock();

    getService = new GetAllByFarmIdUseCase(findAllNode, findNode);

    findAllNode.get.mockResolvedValue(arrayNode);
    findNode.get.mockResolvedValue(addFarms);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(getService, 'execute');
    getService.execute({ farm_id });

    expect(callUser).toHaveBeenCalledWith({ farm_id });
    expect(callUser).toBeCalledTimes(1);
  });

  // // // Tests find node in database response
  it('should find farm repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findNode, 'get');

    await getService.execute({ farm_id });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'farms',
      column: 'farm_id',
      id: farm_id
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if find farm repository return error', () => {
    findNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getService.execute({ farm_id });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should find farm repository to have been called with data valids to have called once time', () => {
    findNode.get.mockResolvedValueOnce(undefined);

    const promise = getService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DataNotFound('Farm'));
  });

  // Tests get By farm

  it('should find all nodes repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findAllNode, 'get');

    await getService.execute({ farm_id });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'farm_id',
      where: farm_id
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if find all nodes repository return error', () => {
    findAllNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getService.execute({ farm_id });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should find all nodes repository to have been called with data valids to have called once time', () => {
    findAllNode.get.mockResolvedValueOnce(undefined);

    const promise = getService.execute({ farm_id });

    expect(promise).rejects.toThrow(new DataNotFound('Node'));
  });

  it('should  return all nodes of the farms  ', async () => {
    const promise = await getService.execute({ farm_id });

    expect(promise).toStrictEqual(arrayNode);
  });
});
