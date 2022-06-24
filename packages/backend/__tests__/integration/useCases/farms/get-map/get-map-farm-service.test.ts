import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { ParamsInvalid, ParamsNotExpected } from '@root/protocols/errors';
import { farmsArray } from '@tests/mocks/data/farms/farms-values-mock';
import { FarmModel } from '@root/database/model/Farm';

describe('Get All Farms Integration', () => {
  let user_id: string;
  let token: string;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();

    await supertest(app).post('/users/signup').send(addUser);

    await supertest(app)
      .post('/users/signin')
      .send({ login: addUser.login, password: addUser.password })
      .then(({ body }) => {
        token = body.token;
        user_id = body.user_id;
      });

    for (let item of farmsArray) {
      await supertest(app)
        .post('/farms/addFarm')
        .send({ ...item, user_id })
        .set('Authorization', token);
    }
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 if received not expected in request.body', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .send({ name: 'soils' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 if received params undefined', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${undefined}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if received params null', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${null}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if received params null', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${null}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should to have array farms with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body[0]).toHaveProperty('user_id');
  });

  it('should to have array farms with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveLength(3);
  });

  it('should be return array empty if no farms found', async () => {
    const promise = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .set('Authorization', token);

    const farms: FarmModel[] = promise.body;
    for (let farm of farms) {
      await supertest(app)
        .delete(`/farms/deleteFarm/${farm.farm_id}`)
        .set('Authorization', token);
    }

    const { status, body } = await supertest(app)
      .get(`/farms/farmUser/${user_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveLength(0);
  });
});
