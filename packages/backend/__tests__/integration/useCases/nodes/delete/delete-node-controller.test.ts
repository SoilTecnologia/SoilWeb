import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { addNode } from '@tests/mocks/data/node';
import {
  DataNotFound,
  ParamsInvalid,
  ParamsNotExpected
} from '@root/protocols/errors';
import { uuidGlobal } from '@tests/mocks/data/global';
import { NodeModel } from '@root/database/model/Node';

describe('Delete Node Integration', () => {
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
        user_id = body.user_id;
        token = body.token;
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
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 404 if not received node_id in params', async () => {
    const { status } = await supertest(app)
      .delete(`/nodes/deleteNode/`)
      .set('Authorization', token);

    expect(status).toBe(404);
  });

  it('should be return 400 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .delete(`/nodes/deleteNode/${node_id}`)
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 if to have received param undefined', async () => {
    const newUserId = undefined;
    const { status, body } = await supertest(app)
      .delete(`/nodes/deleteNode/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 if to have received param null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .delete(`/nodes/deleteNode/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 404 if received more params in route', async () => {
    const { status } = await supertest(app)
      .delete(`/nodes/deleteNode/${token}/${user_id}`)
      .set('Authorization', token);

    expect(status).toBe(404);
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .delete(`/nodes/deleteNode/${node_id}`)
      .send({ user: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 and error if farm not exists in db', async () => {
    const { status, body } = await supertest(app)
      .delete(`/nodes/deleteNode/${uuidGlobal}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Node').message);
  });

  it('should to have param status if db returnered data', async () => {
    const node = await knex<NodeModel>('nodes')
      .insert({ ...addNode, node_num: 8 })
      .returning('*');

    const promise = await supertest(app)
      .delete(`/nodes/deleteNode/${node[0].node_id}`)
      .set('Authorization', token);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('status', 'OK');
  });

  it('should to have param status if db returnered data', async () => {
    const node = await knex<NodeModel>('nodes')
      .insert({ ...addNode, node_num: 8 })
      .returning('*');

    const promise = await supertest(app)
      .delete(`/nodes/deleteNode/${node[0].node_id}`)
      .set('Authorization', token);

    expect(promise.status).toBe(201);
    expect(promise.body).toHaveProperty('status', 'OK');
  });
});
