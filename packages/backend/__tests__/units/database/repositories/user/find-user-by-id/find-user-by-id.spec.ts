import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { IFindUserByIdRepo } from '@root/database/protocols/users';
import { FindUserByIdRepo } from '@root/database/repositories/Users/FindById/FindByIdRepository';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Find User By Id', () => {
  let tracker: Tracker;
  let findById: IFindUserByIdRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    findById = new FindUserByIdRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.select('users').responseOnce(null);
    await findById.findById({ id: 'soil' });

    const insertHistory = tracker.history.select;

    expect(insertHistory[0].method).toEqual('select');
    expect(insertHistory[0].bindings).toStrictEqual(['soil', 1]);
  });

  it('should received a new user of response database ', async () => {
    tracker.on.select('users').responseOnce([userCreated]);
    const promise = await findById.findById({ id: 'soil' });

    expect(promise?.login).toBe('soil');
    expect(promise?.user_id).toBe('soiltech');
    expect(promise?.password).toBe('123456');
    expect(promise?.user_type).toBe('SUDO');
  });
});
