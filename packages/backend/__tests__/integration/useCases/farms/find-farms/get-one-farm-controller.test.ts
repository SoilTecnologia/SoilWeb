import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { ParamsInvalid, ParamsNotExpected } from '@root/protocols/errors';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

describe('Find Farm By Id Integration', () => {
  let token: string;
  const farm_id = addFarms.farm_id;
  let user_id: string;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();
    await supertest(app).post('/users/signup').send(addUser);

    await supertest(app)
      .post('/users/signin')
      .send({ login: addUser.login, password: addUser.password })
      .then(({ body }) => {
        user_id = body.user_id;
        token = body.token;
      });
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 404 if not received params', async () => {
    const { status } = await supertest(app)
      .get('/farms/getOneFarm/')
      .set('Authorization', token);

    expect(status).toBe(404);
  });

  it('should be return error 400  if not params equal null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .get(`/farms/getOneFarm/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error 400  if not params equal undefined', async () => {
    const newUserId = undefined;

    const { status, body } = await supertest(app)
      .get(`/farms/getOneFarm/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .get(`/farms/getOneFarm/${farm_id}`)
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .get(`/farms/getOneFarm/${farm_id}`)
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return error if request.body to have params', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/getOneFarm/${farm_id}`)
      .send({ name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should to have return null if not exists farm', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/getOneFarm/${farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(200);
    expect(body).toMatchObject({});
    expect(body).not.toHaveProperty('farm_id', farm_id);
    expect(body).not.toHaveProperty('user_id', user_id);
    expect(body).not.toHaveProperty('farm_name', addFarms.farm_name);
    expect(body).not.toHaveProperty('farm_city', addFarms.farm_city);
    expect(body).not.toHaveProperty('farm_lng', addFarms.farm_lng);
    expect(body).not.toHaveProperty('farm_lat', addFarms.farm_lat);
  });

  it('should to have return farm if farm exists', async () => {
    await knex('farms').insert({ ...addFarms, user_id });

    const { status, body } = await supertest(app)
      .get(`/farms/getOneFarm/${farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(200);
    expect(body).toHaveProperty('farm_id', farm_id);
    expect(body).toHaveProperty('user_id', user_id);
    expect(body).toHaveProperty('farm_name', addFarms.farm_name);
    expect(body).toHaveProperty('farm_city', addFarms.farm_city);
    expect(body).toHaveProperty('farm_lng', addFarms.farm_lng);
    expect(body).toHaveProperty('farm_lat', addFarms.farm_lat);
  });
});
