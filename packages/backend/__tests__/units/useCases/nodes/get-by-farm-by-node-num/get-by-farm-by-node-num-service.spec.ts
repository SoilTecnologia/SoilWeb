import 'reflect-metadata';
import { mock, MockProxy } from 'jest-mock-extended';
import { IGetByFarmAndNodeNumRepo } from '@database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@protocols/errors';
import { nodeCreated } from '@tests/mocks/data/node';
import { GetByNumByFarmUseCase } from '@root/useCases/data/Nodes/GetByNumByFarm/GetByNumByFarmUseCase';
import { IGetByFarmAndNodeNumService } from '@root/useCases/contracts/nodes/getByFarmAndNodeNum';

describe('Update Node Service', () => {
  let findNode: MockProxy<IGetByFarmAndNodeNumRepo>;
  const node_num = 1;
  const farm_id = 'soiltech';

  let getService: IGetByFarmAndNodeNumService;

  beforeEach(() => {
    findNode = mock();

    getService = new GetByNumByFarmUseCase(findNode);

    findNode.get.mockResolvedValue(nodeCreated);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(getService, 'execute');
    getService.execute({ farm_id, node_num });

    expect(callUser).toHaveBeenCalledWith({ farm_id, node_num });
    expect(callUser).toBeCalledTimes(1);
  });

  // // // Tests find node in database response
  it('should find repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findNode, 'get');

    await getService.execute({ farm_id, node_num });

    expect(fnEncrypted).toHaveBeenCalledWith({
      farm_id,
      node_num
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if find repository return error', () => {
    findNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getService.execute({ farm_id, node_num });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should find repository to have been called with data valids to have called once time', () => {
    findNode.get.mockResolvedValueOnce(undefined);

    const promise = getService.execute({ farm_id, node_num });

    expect(promise).rejects.toThrow(new DataNotFound('Node'));
  });

  it('should  return a node ', async () => {
    const promise = await getService.execute({ farm_id, node_num });

    expect(promise).toStrictEqual(nodeCreated);
  });
});
