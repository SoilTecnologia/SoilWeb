import '@root/shared/container/index';
import supertest from 'supertest';
import knex from '@root/database';
import { app } from '@root/app';
import { mock, MockProxy } from 'jest-mock-extended';
import { ICompareEncrypt } from '@root/useCases/data/User/utils/encrypted-password/protocols';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { UserModel } from '@root/database/model/User';
import { deleteUserMocked } from '@tests/mocks/data/users/delete-user';

describe('Auth Login Controller', () => {
  let compareEncrypt: MockProxy<ICompareEncrypt>;
  const addLogin = { login: 'soil', password: '123456' };

  beforeAll(async () => {
    compareEncrypt = mock();
    await knex.migrate.down();
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const promise = await supertest(app).post('/users/signin').send({});

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const promise = await supertest(app)
      .post('/users/signin')
      .send({ ...addLogin, name: 'soil' });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      `Received Params not expected`
    );
  });

  it('should be return type params error if received password type not valid', async () => {
    const promise = await supertest(app)
      .post('/users/signin')
      .send({ ...addLogin, password: 32 });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid password`);
  });

  it('should be return type params error if received login type not valid', async () => {
    const promise = await supertest(app)
      .post('/users/signin')
      .send({ ...addLogin, login: 32 });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid login`);
  });

  it('should return Credential invalids if user not exists', async () => {
    await deleteUserMocked(addLogin.login);
    const promise = await supertest(app).post('/users/signin').send(addLogin);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', 'Invalid Credentials');
  });

  it('should return Credential invalids if password not correctly', async () => {
    const user = await knex('users')
      .select('*')
      .where('login', addLogin.login)
      .first();
    if (!user) await supertest(app).post('/users/signup').send(addUser);

    const promise = await supertest(app)
      .post('/users/signin')
      .send({ ...addLogin, password: '654321' });

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', 'Invalid Credentials');
  });

  it('should return data valid code 201 and user response with token ', async () => {
    const user = await knex<UserModel>('users')
      .select('*')
      .where('login', addLogin.login)
      .first();
    if (!user) await supertest(app).post('/users/signup').send(addUser);

    const promise = await supertest(app).post('/users/signin').send(addLogin);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('token');
    expect(promise.body).toHaveProperty('user_id');
    expect(promise.body).toHaveProperty('user_type', 'SUDO');
  });
});
