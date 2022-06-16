import request from 'supertest';
import '@root/shared/container/index';
import knexConfig from '@root/knexfile';
import knex, { Knex } from 'knex';
import {
  ICreateUserController,
  ICreateUserUseCase
} from '@root/database/protocols/users';
import { app } from '@root/app';

describe('books', () => {
  let knexMock: Knex;
  let addUser: ICreateUserUseCase.Params;
  let userResponse: ICreateUserUseCase.Response;
  let createUserController: ICreateUserController;

  beforeAll(async () => {
    knexMock = knex({
      ...knexConfig.test,
      connection: {
        filename: ':memory:',
        flags: ['OPEN_URI', 'OPEN_SHAREDCACHE']
      }
    });

    await knexMock.migrate.latest();
    addUser = {
      login: 'soil',
      password: 'password_encrypted',
      user_type: 'SUDO'
    };
    userResponse = {
      user_id: 'soiltech',
      user_type: 'SUDO',
      token: 'soiltech'
    };
  });

  afterAll(() => {
    knexMock.destroy();
  });

  it('new test', async () => {
    const promise = await request(app).post('/users/signup').send(addUser);

    console.log(promise);
    expect((await promise).status).toBe(200);
  });
});
