import 'reflect-metadata';
import '@tests/setup/unit/setup';

import { mock, MockProxy } from 'jest-mock-extended';
import {
  ICreateBaseRepo,
  IGetByFarmAndNodeNumRepo,
  IGetByIdBaseRepo
} from '@database/protocols';
import {
  AlreadyExistsError,
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound,
  FailedCreateDataError
} from '@protocols/errors';
import { NodeModel } from '@root/database/model/Node';
import { ICreateNodeService } from '@root/useCases/contracts/nodes/create';
import { CreateNodeUseCase } from '@root/useCases/data/Nodes/CreateNode/CreateNodeUseCase';
import { addNode, nodeCreated } from '@tests/mocks/data/node';
import { FarmModel } from '@root/database/model/Farm';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

describe('Create User Use Case', () => {
  let addRepo: MockProxy<ICreateBaseRepo>;
  let findNode: MockProxy<IGetByFarmAndNodeNumRepo>;
  let findFarm: MockProxy<IGetByIdBaseRepo>;

  let createNode: ICreateNodeService;

  beforeEach(() => {
    addRepo = mock();
    findNode = mock();
    findFarm = mock();

    createNode = new CreateNodeUseCase(findNode, findFarm, addRepo);

    findNode.get.mockResolvedValue(undefined);
    findFarm.get.mockResolvedValue(addFarms);
    addRepo.create.mockResolvedValue(nodeCreated);
  });

  // Test received data corrects
  it('should to have been called with params válids and called once time', async () => {
    const callUser = jest.spyOn(createNode, 'execute');
    createNode.execute(addNode);

    expect(callUser).toHaveBeenCalledWith(addNode);
    expect(callUser).toBeCalledTimes(1);
  });
  // Tests data Gprs
  it('should return error if type node is gateway and not received gateway ip', () => {
    const response = createNode.execute({
      ...addNode,
      is_gprs: false
    });

    expect(response).rejects.toThrow(
      new Error('Node Type Gateway required a gateway ip')
    );
  });

  it('should return error if type node is gprs and received gateway ip', () => {
    const response = createNode.execute({
      ...addNode,
      gateway: '192.100'
    });

    expect(response).rejects.toThrow(
      new Error('Node Gprs not accept ip gateway')
    );
  });

  //tests FindFarm
  it('should find farm repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findFarm, 'get');

    await createNode.execute(addNode);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'farms',
      column: 'farm_id',
      id: addFarms.farm_id
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error if repository return message error', () => {
    findFarm.get.mockResolvedValueOnce(DATABASE_ERROR);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw  error if farm not exists', () => {
    findFarm.get.mockResolvedValueOnce(undefined);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new DataNotFound('Farm'));
  });

  // // Tests find node in database response
  it('should find repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(findNode, 'get');

    await createNode.execute(addNode);

    expect(fnEncrypted).toHaveBeenCalledWith({
      farm_id: addNode.farm_id,
      node_num: addNode.node_num
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error if repository return message error', () => {
    findNode.get.mockResolvedValueOnce(DATABASE_ERROR);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw  error if node already exists', () => {
    findNode.get.mockResolvedValueOnce(nodeCreated);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new AlreadyExistsError('Node'));
  });
  // Check value gateway
  it('should create node to have called with gateway value and node_num 0 if node not is gprs', async () => {
    const fnEncrypted = jest.spyOn(addRepo, 'create');

    await createNode.execute({
      ...addNode,
      is_gprs: false,
      gateway: '192.100'
    });

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      data: { ...addNode, is_gprs: false, gateway: '192.100', node_num: 0 }
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  //Test create node
  it('should find repository to have been called with data valids to have called once time', async () => {
    const fnEncrypted = jest.spyOn(addRepo, 'create');

    await createNode.execute(addNode);

    expect(fnEncrypted).toHaveBeenCalledWith({
      table: 'nodes',
      data: { ...addNode, gateway: null }
    });
    expect(fnEncrypted).toBeCalledTimes(1);
  });

  it('should throw database error if repository return message error', () => {
    addRepo.create.mockResolvedValueOnce(DATABASE_ERROR);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new DatabaseErrorReturn());
  });

  it('should throw  error if node created node', () => {
    addRepo.create.mockResolvedValueOnce(undefined);

    const response = createNode.execute(addNode);

    expect(response).rejects.toThrow(new FailedCreateDataError('Node'));
  });

  // //Test response useCases

  it('should to have a userResponse valid with token válid', async () => {
    const promise = await createNode.execute(addNode);

    expect(promise).toHaveProperty('farm_id', nodeCreated.farm_id);
    expect(promise).toHaveProperty('node_id', nodeCreated.node_id);
    expect(promise).toHaveProperty('node_num', nodeCreated.node_num);
    expect(promise).toHaveProperty('is_gprs', nodeCreated.is_gprs);
    expect(promise).toHaveProperty('gateway', nodeCreated.gateway);
  });
});
