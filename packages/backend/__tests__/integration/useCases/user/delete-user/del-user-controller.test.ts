import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { UserResponseData } from '@root/useCases/contracts';
import { uuidGlobal } from '@tests/mocks/data/global';
import {
  DataNotFound,
  ParamsInvalid,
  ParamsNotExpected
} from '@root/protocols/errors';

describe('Delete User Integration', () => {
  let user: UserResponseData;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();

    await supertest(app).post('/users/signup').send(addUser);
    await supertest(app)
      .post('/users/signin')
      .send({ login: addUser.login, password: addUser.password })
      .then(({ body }) => (user = body));
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 404 if not received user_id in params', async () => {
    const { status } = await supertest(app)
      .delete(`/users/delUser/`)
      .set('Authorization', user.token);

    expect(status).toBe(404);
  });

  it('should be return 400 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .delete(`/users/delUser/${user.user_id}`)
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 if to have received param undefined', async () => {
    const newUserId = undefined;
    const { status, body } = await supertest(app)
      .delete(`/users/delUser/${newUserId}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if to have received param null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .delete(`/users/delUser/${newUserId}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 404 if received more params in route', async () => {
    const { status } = await supertest(app)
      .delete(`/users/delUser/${user.token}/${user.user_id}`)
      .set('Authorization', user.token);

    expect(status).toBe(404);
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .delete(`/users/delUser/${user.user_id}`)
      .send({ user: 'soil' })
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 and error user not exists if not exists in db', async () => {
    const { status, body } = await supertest(app)
      .delete(`/users/delUser/${uuidGlobal}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('User').message);
  });

  it('should to have param status if db returnered data', async () => {
    const { body } = await supertest(app)
      .post('/users/signup')
      .send({ ...addUser, login: 'soils' });

    const promise = await supertest(app)
      .delete(`/users/delUser/${body.user_id}`)
      .set('Authorization', user.token);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('status', 'OK');
  });
});
