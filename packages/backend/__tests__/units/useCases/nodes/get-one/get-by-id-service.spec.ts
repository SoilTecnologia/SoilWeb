import 'reflect-metadata';
import { mock, MockProxy } from 'jest-mock-extended';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsEquals
} from '@protocols/errors';
import { NodeModel } from '@root/database/model/Node';
import { nodeCreated } from '@tests/mocks/data/node';
import { UpdateNodeUseCase } from '@root/useCases/data/Nodes/UpdateNode/UpdateNodeUseCase';
import { IUpdateNodeService } from '@root/useCases/contracts';
import { IGetOneNodeService } from '@root/useCases/contracts/nodes/get-one';
import { GetOneNodeUseCase } from '@root/useCases/data/Nodes/GetOneNode/GetOneNodeUseCase';

describe('Update Node Service', () => {
  let findNode: MockProxy<IGetByIdBaseRepo>;
  const node_id = nodeCreated.node_id!!;

  let getService: IGetOneNodeService;

  beforeEach(() => {
    findNode = mock();

    getService = new GetOneNodeUseCase(findNode);

    findNode.get.mockResolvedValue(nodeCreated);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(getService, 'execute');
    getService.execute({ node_id });

    expect(callUser).toHaveBeenCalledWith({ node_id });
    expect(callUser).toBeCalledTimes(1);
  });

  // // // Tests find node in database response
  it('should find repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findNode, 'get');

    await getService.execute({ node_id });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'node_id',
      id: nodeCreated.node_id
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if find repository return error', () => {
    findNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = getService.execute({ node_id });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should find repository to have been called with data valids to have called once time', () => {
    findNode.get.mockResolvedValueOnce(undefined);

    const promise = getService.execute({ node_id });

    expect(promise).rejects.toThrow(new DataNotFound('Node'));
  });

  it('should  return a node ', async () => {
    const promise = await getService.execute({ node_id });

    expect(promise).toStrictEqual(nodeCreated);
  });
});
