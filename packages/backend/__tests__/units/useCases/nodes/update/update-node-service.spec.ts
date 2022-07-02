import 'reflect-metadata';
import '@tests/setup/unit/setup';

import { mock, MockProxy } from 'jest-mock-extended';
import { IGetByIdBaseRepo, IUpdateBaseRepo } from '@database/protocols';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  NotUpdateError,
  ParamsEquals
} from '@protocols/errors';
import { nodeCreated } from '@tests/mocks/data/node';
import { UpdateNodeUseCase } from '@root/useCases/data/Nodes/UpdateNode/UpdateNodeUseCase';
import { IUpdateNodeService } from '@root/useCases/contracts';

describe('Update Node Service', () => {
  let putNode: MockProxy<IUpdateBaseRepo>;
  let findNode: MockProxy<IGetByIdBaseRepo>;

  let createNode: IUpdateNodeService;

  beforeEach(() => {
    putNode = mock();
    findNode = mock();

    createNode = new UpdateNodeUseCase(findNode, putNode);

    findNode.get.mockResolvedValue(nodeCreated);
    putNode.put.mockResolvedValue(nodeCreated);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(createNode, 'execute');
    createNode.execute({ ...nodeCreated, node_num: 5 });

    expect(callUser).toHaveBeenCalledWith({
      ...nodeCreated,
      node_num: 5
    });
    expect(callUser).toBeCalledTimes(1);
  });

  // // Tests find node in database response
  it('should find repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findNode, 'get');

    await createNode.execute({ ...nodeCreated, node_num: 5 });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'node_id',
      id: nodeCreated.node_id
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if find repository return error', () => {
    findNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createNode.execute({
      ...nodeCreated,
      node_num: 5
    });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should find repository to have been called with data valids to have called once time', () => {
    findNode.get.mockResolvedValueOnce(undefined);

    const promise = createNode.execute({
      ...nodeCreated,
      node_num: 5
    });

    expect(promise).rejects.toThrow(new DataNotFound('Node'));
  });

  // // Testes update node
  it('should put repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(putNode, 'put');

    await createNode.execute({ ...nodeCreated, node_num: 5 });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'node_id',
      where: nodeCreated.node_id!,
      data: { ...nodeCreated, node_num: 5 }
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should to throw if put repository return error', () => {
    putNode.put.mockResolvedValueOnce(DATABASE_ERROR);

    const promise = createNode.execute({
      ...nodeCreated,
      node_num: 5
    });
    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should to throw if put repository return undefined', () => {
    putNode.put.mockResolvedValueOnce(undefined);

    const promise = createNode.execute({
      ...nodeCreated,
      node_num: 5
    });
    expect(promise).rejects.toThrow(new NotUpdateError('Node'));
  });

  // returns useCases
  it('should  to throw if values equals', () => {
    const promise = createNode.execute(nodeCreated);

    expect(promise).rejects.toThrow(new ParamsEquals());
  });

  it('should  return a new node ', async () => {
    const promise = await createNode.execute({
      ...nodeCreated,
      node_num: 5
    });

    expect(promise).toStrictEqual({ ...nodeCreated, node_num: 1 });
  });
});
