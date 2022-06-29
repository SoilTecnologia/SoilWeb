import '@root/shared/container/index';
import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { mock, MockProxy } from 'jest-mock-extended';
import { DeleteFarmUseCase } from '@root/useCases/data';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { FarmModel } from '@root/database/model/Farm';
import { NodeModel } from '@root/database/model/Node';
import { IDeleteNodeService } from '@root/useCases/contracts/nodes/delete';
import { nodeCreated } from '@tests/mocks/data/node';
import { DeleteNodeUseCase } from '@root/useCases/data/Nodes/DeleteNode/DeleteNodeUseCase';

describe('Delete Farm Service', () => {
  let findNode: MockProxy<IGetByIdBaseRepo<NodeModel>>;
  let delNode: MockProxy<IDeleteBaseRepo<NodeModel>>;
  let deleteNodeService: IDeleteNodeService;
  const node_id = nodeCreated.node_id!!;

  beforeAll(async () => {
    findNode = mock();
    delNode = mock();

    deleteNodeService = new DeleteNodeUseCase(findNode, delNode);

    findNode.get.mockResolvedValue(nodeCreated);
    delNode.del.mockResolvedValue(1);
  });

  // Teste params received
  it('should delete farm usecase to have been calles with params correctly ', () => {
    const spyService = jest.spyOn(deleteNodeService, 'execute');

    deleteNodeService.execute({ node_id });

    expect(spyService).toHaveBeenCalledWith({ node_id });
  });

  // Tests return databse

  it('should findNode to have been called with params correctly ', async () => {
    const fnfindNode = jest.spyOn(findNode, 'get');

    await deleteNodeService.execute({ node_id });

    expect(fnfindNode).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'node_id',
      id: node_id
    });
  });

  it('should return error if not exists farm in database ', () => {
    jest.spyOn(findNode, 'get').mockResolvedValueOnce(undefined);

    const promise = deleteNodeService.execute({ node_id });

    expect(promise).rejects.toThrow(new DataNotFound('Node'));
  });

  it('should return error if database return a error ', () => {
    jest.spyOn(findNode, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = deleteNodeService.execute({ node_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // //Tests return Database Deletefarm

  it('should delNode to have been called with params correctly ', async () => {
    const fndelNode = jest.spyOn(delNode, 'del');

    await deleteNodeService.execute({ node_id });

    expect(fndelNode).toHaveBeenCalledWith({
      table: 'nodes',
      column: 'node_id',
      data: node_id
    });
  });

  it('should return error if delete user database return a error ', () => {
    jest.spyOn(delNode, 'del').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = deleteNodeService.execute({ node_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // // Return final

  it('should return error if not response delete farm ', async () => {
    jest.spyOn(delNode, 'del').mockResolvedValueOnce(undefined);

    const promise = await deleteNodeService.execute({ node_id });

    expect(promise).toHaveProperty('status', 'FAIL');
  });

  it('should return status ok if farm deleted with sucessfully ', async () => {
    const promise = await deleteNodeService.execute({ node_id });

    expect(promise).toHaveProperty('status', 'OK');
  });
});
