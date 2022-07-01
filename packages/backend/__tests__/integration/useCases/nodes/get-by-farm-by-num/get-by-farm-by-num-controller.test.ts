import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import {
  DataNotFound,
  ParamsInvalid,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { addNode } from '@tests/mocks/data/node';
import { uuidGlobal } from '@tests/mocks/data/global';

describe('Find Node By Farm By Node NUm Integration', () => {
  let token: string;
  let node_id: string;
  let user_id: string;
  const farm_id = addFarms.farm_id;

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

  it('should be return 404 if not received params', async () => {
    const { status } = await supertest(app)
      .get('/nodes/nodeNum/')
      .set('Authorization', token);

    expect(status).toBe(404);
  });

  it('should be return error 400  if not params equal null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${newUserId}/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error 400  if second params equal null', async () => {
    const newUserId = null;
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${1}/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error 400  if second params equal undefined', async () => {
    const newUserId = undefined;
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${1}/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error 400  if not params equal undefined', async () => {
    const newUserId = undefined;

    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${newUserId}/${newUserId}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .get(`/nodes/nodeNum/${1}/${farm_id}`)
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return error if request.body to have params', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${1}/${farm_id}`)
      .send({ name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should to have return error if node_num not  a number', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${uuidGlobal}/${farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('node_num').message
    );
  });

  it('should to have return error if not exists node', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${2}/${farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Node').message);
  });

  it('should to have return node if node exists', async () => {
    const { status, body } = await supertest(app)
      .get(`/nodes/nodeNum/${addNode.node_num}/${addNode.farm_id}`)
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('node_id');
    expect(body).toHaveProperty('node_num', addNode.node_num);
    expect(body).toHaveProperty('farm_id', addNode.farm_id);
    expect(body).toHaveProperty('gateway', null);
    expect(body).toHaveProperty('is_gprs', addNode.is_gprs);
  });
});
