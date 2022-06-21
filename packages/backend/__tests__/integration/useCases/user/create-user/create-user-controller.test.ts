import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { deleteUserMocked } from '@tests/mocks/data/users/delete-user';

describe('books', () => {
  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const promise = await supertest(app).post('/users/signup').send({});

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const promise = await supertest(app)
      .post('/users/signup')
      .send({ ...addUser, name: 'soil' });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      `Received Params not expected`
    );
  });

  it('should be return type params error if received password type not valid', async () => {
    const promise = await supertest(app)
      .post('/users/signup')
      .send({ ...addUser, password: 32 });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid password`);
  });

  it('should be return type params error if received login type not valid', async () => {
    const promise = await supertest(app)
      .post('/users/signup')
      .send({ ...addUser, login: 32 });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid login`);
  });

  it('should be return type params error if received user_type type not valid', async () => {
    const promise = await supertest(app)
      .post('/users/signup')
      .send({ ...addUser, user_type: 32 });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid user_type`);
  });

  it('should error if already exists a user in database', async () => {
    const user = await knex('users')
      .select('*')
      .where({ login: addUser })
      .first();
    if (!user) await supertest(app).post('/users/signup').send(addUser);

    const promise = await supertest(app).post('/users/signup').send(addUser);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `User Already Exists`);
  });

  it('should be return a status 201 and a user-response data valids with request call with params válids', async () => {
    await deleteUserMocked(addUser.login);

    const promise = await supertest(app).post('/users/signup').send(addUser);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('user_id');
    expect(promise.body).toHaveProperty('token');
    expect(promise.body).toHaveProperty('user_type', 'SUDO');
  });
});
