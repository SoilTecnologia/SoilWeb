import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import {
  DataNotFound,
  ParamsInvalid,
  ParamsNotExpected
} from '@root/protocols/errors';
import {
  addFarms,
  farmsArray
} from '@tests/mocks/data/farms/farms-values-mock';
import { FarmModel } from '@root/database/model/Farm';
import { addNode, arrayNode } from '@tests/mocks/data/node';

describe('Get All Farms Integration', () => {
  let user_id: string;
  let token: string;
  let node_id: string;

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

    await supertest(app)
      .post('/farms/addFarm')
      .send({ ...addFarms, user_id })
      .set('Authorization', token);

    await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode })
      .set('Authorization', token)
      .then(({ body }) => (node_id = body.node_id));

    for (let count = 2; count < 4; count++) {
      await knex('nodes').insert({
        ...addNode,
        farm_id: addFarms.farm_id,
        node_num: count
      });
    }
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .get(`/nodes/readAll/${user_id}`)
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });
  it('should be return 400 if received not expected in request.body', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${user_id}`)
      .send({ name: 'soils' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 if received params undefined', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${undefined}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if received params null', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${null}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if received farm does not exist', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/f9a16ff7-4a31-11eb-be7b-8344edc8f36b`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Farm').message);
  });

  it('should to have array farms with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${addFarms.farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body[0]).toHaveProperty('node_id');
  });

  it('should to have array farms with database', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${addFarms.farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveLength(3);
  });

  it('should be return array empty if no farms found', async () => {
    await knex('nodes').select('*').del();

    const { status, body } = await supertest(app)
      .get(`/nodes/readAll/${addFarms.farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveLength(0);
  });
});
