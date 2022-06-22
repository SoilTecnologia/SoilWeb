import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { IFindUserByLoginRepo } from '@root/database/protocols/users';
import { FindUserByLoginRepo } from '@root/database/repositories/Users/FindByLogin/FindByLoginRTepository';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Find User By Login Repository', () => {
  let tracker: Tracker;
  let findByLogin: IFindUserByLoginRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    findByLogin = new FindUserByLoginRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.select('users').responseOnce(userCreated);
    await findByLogin.findUserByLogin('soil');

    const insertHistory = tracker.history.select;

    expect(insertHistory[0].method).toEqual('select');
    expect(insertHistory[0].bindings).toStrictEqual(['soil', 1]);
  });

  it('should received a new user of response database ', async () => {
    tracker.on.select('users').responseOnce([userCreated]);
    const promise = await findByLogin.findUserByLogin('soil');

    expect(promise?.login).toBe('soil');
    expect(promise?.user_id).toBe('soiltech');
    expect(promise?.password).toBe('123456');
    expect(promise?.user_type).toBe('SUDO');
  });
});
