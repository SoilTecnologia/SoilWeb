import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { addNode, arrayNode } from '@tests/mocks/data/node';
import {
  AlreadyExistsError,
  DataNotFound,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';

describe('Create Nodes Integration', () => {
  let token: string;
  let user_id: string;
  const farm_id = addFarms.farm_id!;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();
    await supertest(app).post('/users/signup').send(addUser);

    await supertest(app)
      .post('/users/signin')
      .send({ login: addUser.login, password: addUser.password })
      .then(async ({ body }) => {
        user_id = body.user_id;
        token = body.token;
      });

    await supertest(app)
      .post('/farms/addFarm')
      .set('Authorization', token)
      .send({ ...addFarms, user_id });
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({})
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .post('/nodes/addNode')
      .send(addNode)
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return type params error if received farm_id type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, farm_id: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('farm_id').message);
  });

  it('should be return type params error if received node_num type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, is_gprs: '45' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('is_gprs').message);
  });

  it('should be return farm not exists ', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, farm_id: 'not_exists' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Farm').message);
  });

  it('should be return farm not exists ', async () => {
    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, farm_id: 'not_exists' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Farm').message);
  });

  it('should be return node already exists if exists farm in db', async () => {
    const farmSelect = await knex('nodes')
      .select('*')
      .where({ farm_id: addNode.farm_id, node_num: addNode.node_num })
      .first();

    if (!farmSelect) await knex('nodes').insert(addNode);

    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send(addNode)
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new AlreadyExistsError('Node').message
    );
  });

  it('should be return type params error if received node_num type not valid', async () => {
    const node = await knex('nodes')
      .select('*')
      .where({ farm_id: addNode.farm_id, node_num: addNode.node_num })
      .first();

    if (node) await knex('nodes').select('*').del();

    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, is_gprs: false, gateway: '192.100' })
      .set('Authorization', token);

    expect(status).toBe(201);
  });

  it('should be return a status 201 and a new farm', async () => {
    await knex('nodes').select('*').del();

    const farm = await knex('farms').select('*').where({ farm_id }).first();

    if (!farm)
      await supertest(app)
        .post('/farms/addFarm')
        .set('Authorization', token)
        .send({ ...addFarms, user_id, farm_id });

    const { status, body } = await supertest(app)
      .post('/nodes/addNode')
      .send({ ...addNode, farm_id })
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('farm_id', farm_id);
  });
});
