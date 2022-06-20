import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { IDeleteUserRepo } from '@root/database/protocols/users';
import { AddNewUserRepo } from '@root/database/repositories/Users/AddUser/AddNewUserRepository';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';
import { DeleteUserRepo } from '@root/database/repositories/Users/DeleteUser/DeleteUserRepository';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Delete User Repository', () => {
  let tracker: Tracker;
  let delUser: IDeleteUserRepo;
  const user_id = 'soiltech';

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    delUser = new DeleteUserRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.delete('users').responseOnce(1);
    await delUser.deleteUser({ user_id });

    const insertHistory = tracker.history.delete;

    expect(insertHistory[0].method).toEqual('delete');
    expect(insertHistory[0].bindings).toEqual([user_id]);
  });

  it('should repository return what db returnered ', async () => {
    tracker.on.delete('users').responseOnce(1);
    const promise = await delUser.deleteUser({ user_id });

    expect(promise).toBe(1);
  });

  it('should throw error if database error', async () => {
    tracker.on.delete('users').simulateErrorOnce('database error');
    await delUser.deleteUser({ user_id }).catch((err) => {
      expect(err.message).toBe(
        'delete from "users" where "user_id" = $1 - database error'
      );
    });
  });
});
