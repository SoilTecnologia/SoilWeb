import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { UserResponseData } from '@root/useCases/contracts';
import { UserModel } from '@root/database/model/User';
import { DataNotFound, ParamsNotExpected } from '@root/protocols/errors';

describe('Get All Users Integration', () => {
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

  it('should be return 400 if received not expected in request.body', async () => {
    const { status, body } = await supertest(app)
      .get(`/users/allUsers/`)
      .send({ name: 'soils' })
      .set('Authorization', userAuth!!.token!!);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .get(`/users/allUsers/`)
      .send({ name: 'soils' })
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should to have array users with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/users/allUsers`)
      .set('Authorization', userAuth.token);

    expect(status).toBe(201);
    expect(body[0]).toHaveProperty('user_id');
    expect(body[0]).toHaveProperty('user_type');
    expect(body[0]).toHaveProperty('password');
    expect(body[0]).toHaveProperty('login');
  });

  it('should to have array users with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/users/allUsers`)
      .set('Authorization', userAuth.token);

    expect(status).toBe(201);
    expect(body).toHaveLength(3);
  });

  it('should be return 400 if no users found', async () => {
    const promise = await supertest(app)
      .get(`/users/allUsers`)
      .set('Authorization', userAuth.token);

    const users: UserModel[] = promise.body;
    for (let user of users) {
      await supertest(app)
        .delete(`/users/delUser/${user.user_id}`)
        .set('Authorization', userAuth.token);
    }

    const { status, body } = await supertest(app)
      .get(`/users/allUsers`)
      .set('Authorization', userAuth.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('User').message);
  });
});
