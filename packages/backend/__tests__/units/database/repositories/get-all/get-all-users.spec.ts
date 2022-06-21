import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { IGetAllUserRepo } from '@root/database/protocols/users/get-all/IGetAllUserRepo';
import { GetAllUserRepo } from '@root/database/repositories/Users/getAll/GetAllRepo';
import { usersArray } from '@tests/mocks/data/users/user-values-for-mocks';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Get All User Repository', () => {
  let tracker: Tracker;
  let getUsers: IGetAllUserRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    getUsers = new GetAllUserRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.select('users').responseOnce([usersArray]);
    await getUsers.getAll();

    const insertHistory = tracker.history.select;

    expect(insertHistory[0].method).toEqual('select');
  });

  it('should repository return what db returnered ', async () => {
    tracker.on.select('users').responseOnce(usersArray);
    const promise = await getUsers.getAll();

    expect(promise).toStrictEqual(usersArray);
  });

  it('should throw error if database error', async () => {
    tracker.on.select('users').simulateErrorOnce('database error');
    await getUsers.getAll().catch((err) => {
      expect(err.message).toBe('select * from "users" - database error');
    });
  });
});
