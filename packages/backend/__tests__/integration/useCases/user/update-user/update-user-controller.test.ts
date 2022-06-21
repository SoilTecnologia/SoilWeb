import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import {
  addUser,
  userCreated
} from '@tests/mocks/data/users/user-values-for-mocks';
import { UserResponseData } from '@root/useCases/contracts/users/create-user/create-user-protocol';

describe('Update User Integration', () => {
  let userAuth: UserResponseData;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();

    for (let i = 0; i < 3; i++) {
      const login = `${addUser.login}_${i + 1}`;
      await supertest(app)
        .post('/users/signup')
        .send({ ...addUser, login });
    }

    await supertest(app)
      .post('/users/signin')
      .send({ login: `${addUser.login}_1`, password: addUser.password })
      .then(({ body }) => (userAuth = body));
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({})
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .put('/users/putUser')
      .send({ name: 'soils' })
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, name: 'soil' })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      `Received Params not expected`
    );
  });

  it('should be return type params error if received password type not valid', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, password: 32 })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid password`);
  });

  it('should be return type params error if received login type not valid', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, login: 32 })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid login`);
  });

  it('should be return type params error if received user_type type not valid', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, user_type: 32 })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid user_type`);
  });

  it('should be return type params error if received user_id type not valid', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, user_id: 32 })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `Type Data Inválid user_id`);
  });

  it('should be return user does not found if not exits user in db', async () => {
    const promise = await supertest(app)
      .put('/users/putUser')
      .send({ ...userCreated, user_id: 'user_not_exists' })
      .set('Authorization', userAuth.token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', `User does not find`);
  });
  it('should be return a status 201 and a user-response data valids with request call with params válids', async () => {
    const promise = await supertest(app)
      .get(`/users/allUsers`)
      .set('Authorization', userAuth.token);

    const [user] = promise.body;

    const { body, status } = await supertest(app)
      .put('/users/putUser')
      .send({
        ...user,
        login: 'soil_updated'
      })
      .set('Authorization', userAuth.token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('user_id');
    expect(body).toHaveProperty('user_type', 'SUDO');
    expect(body).toHaveProperty('password');
    expect(body).toHaveProperty('login', 'soil_updated');
  });
});
