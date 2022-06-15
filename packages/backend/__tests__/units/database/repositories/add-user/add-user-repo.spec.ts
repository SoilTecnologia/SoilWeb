import { getTracker, Tracker } from 'knex-mock-client';
import { ICreateUserRepository } from '@root/database/protocols/users';
import { AddNewUserRepo } from '@root/database/repositories/Users/AddUser/AddNewUserRepository';

describe('Add User Repository', () => {
  let tracker: Tracker;
  let addUserRepo: ICreateUserRepository;
  let addUSer: ICreateUserRepository.Params;
  let userResponse: ICreateUserRepository.Response;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    addUserRepo = new AddNewUserRepo();

    addUSer = {
      login: 'soil',
      password: 'password_encrypted',
      user_type: 'SUDO'
    };

    userResponse = {
      user_id: 'soiltech',
      login: 'soil',
      password: '123456',
      user_type: 'SUDO'
    };
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.insert('users').responseOnce([userResponse]);
    await addUserRepo.create(addUSer);

    const insertHistory = tracker.history.insert;

    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toEqual([
      addUSer.login,
      addUSer.password,
      addUSer.user_type
    ]);
  });

  it('should received a new user of response database ', async () => {
    tracker.on.insert('users').responseOnce([userResponse]);
    const promise = await addUserRepo.create(addUSer);

    expect(promise?.login).toBe('soil');
    expect(promise?.user_id).toBe('soiltech');
    expect(promise?.password).toBe('123456');
    expect(promise?.user_type).toBe('SUDO');
  });

  it('should throw error if database error', async () => {
    tracker.on.insert('users').simulateErrorOnce('database error');
    await addUserRepo.create(addUSer).catch((err) => {
      expect(err.message).toBe(
        'insert into "users" ("login", "password", "user_type") values ($1, $2, $3) returning * - database error'
      );
    });
  });
});
