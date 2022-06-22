import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { ICreateUserRepository } from '@root/database/protocols/users';
import { AddNewUserRepo } from '@root/database/repositories/Users/AddUser/AddNewUserRepository';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Add User Repository', () => {
  let tracker: Tracker;
  let addUserRepo: ICreateUserRepository;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    addUserRepo = new AddNewUserRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.insert('users').responseOnce([userCreated]);
    await addUserRepo.create(addUser);

    const insertHistory = tracker.history.insert;

    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toEqual([
      addUser.login,
      addUser.password,
      addUser.user_type
    ]);
  });

  it('should received a new user of response database ', async () => {
    tracker.on.insert('users').responseOnce([userCreated]);
    const promise = await addUserRepo.create(addUser);

    expect(promise?.login).toBe('soil');
    expect(promise?.user_id).toBe('soiltech');
    expect(promise?.password).toBe('123456');
    expect(promise?.user_type).toBe('SUDO');
  });

  it('should throw error if database error', async () => {
    tracker.on.insert('users').simulateErrorOnce('database error');
    const response = addUserRepo.create(addUser);

    expect(response).rejects.toThrow();
  });
});
