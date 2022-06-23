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
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

describe('Delete Farm Integration', () => {
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
      .delete(`/farms/deleteFarm/`)
      .set('Authorization', user.token);

    expect(status).toBe(404);
  });

  it('should be return 400 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .delete(`/farms/deleteFarm/${user.user_id}`)
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 if to have received param undefined', async () => {
    const newUserId = undefined;
    const { status, body } = await supertest(app)
      .delete(`/farms/deleteFarm/${newUserId}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if to have received param null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .delete(`/farms/deleteFarm/${newUserId}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 404 if received more params in route', async () => {
    const { status } = await supertest(app)
      .delete(`/farms/deleteFarm/${user.token}/${user.user_id}`)
      .set('Authorization', user.token);

    expect(status).toBe(404);
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .delete(`/farms/deleteFarm/${user.user_id}`)
      .send({ user: 'soil' })
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 and error if farm not exists in db', async () => {
    const { status, body } = await supertest(app)
      .delete(`/farms/deleteFarm/${uuidGlobal}`)
      .set('Authorization', user.token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Farm').message);
  });

  it('should to have param status if db returnered data', async () => {
    await knex('farms').insert({ ...addFarms, user_id: user.user_id });

    const promise = await supertest(app)
      .delete(`/farms/deleteFarm/${addFarms.farm_id}`)
      .set('Authorization', user.token);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('status', 'OK');
  });
});
