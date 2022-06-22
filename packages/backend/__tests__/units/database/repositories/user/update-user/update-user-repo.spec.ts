import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { IUpdateUserRepo } from '@root/database/protocols/users/update/IUpdateUserRepo';
import { UpdateUserRepo } from '@root/database/repositories/Users/UpdateUser/UpdateUserRepo';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Update User Repository', () => {
  let tracker: Tracker;
  let putUserRepo: IUpdateUserRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    putUserRepo = new UpdateUserRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.update('users').responseOnce([userCreated]);
    await putUserRepo.update(userCreated!);

    const insertHistory = tracker.history.update;

    expect(insertHistory[0].method).toEqual('update');
    expect(insertHistory[0].bindings).toStrictEqual([
      userCreated!.login,
      userCreated!.password,
      userCreated?.user_type,
      userCreated?.user_id,
      userCreated?.user_id
    ]);
  });

  it('should received a new user of response database ', async () => {
    tracker.on.update('users').responseOnce([userCreated]);
    const promise = await putUserRepo.update(userCreated!);

    expect(promise?.login).toBe('soil');
    expect(promise?.user_id).toBe('soiltech');
    expect(promise?.password).toBe('123456');
    expect(promise?.user_type).toBe('SUDO');
  });

  it('should throw error if database error', () => {
    tracker.on.update('users').simulateErrorOnce('database error');
    const response = putUserRepo.update(userCreated!);

    expect(response).rejects.toThrow();
  });
});
