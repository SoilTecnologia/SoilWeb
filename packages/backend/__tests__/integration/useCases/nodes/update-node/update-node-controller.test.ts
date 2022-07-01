import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';

import {
  DatabaseErrorReturn,
  DataNotFound,
  ParamsEquals,
  ParamsInvalid,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { addNode, nodeCreated } from '@tests/mocks/data/node';
import { uuidGlobal } from '@tests/mocks/data/global';

describe('Update Node Integration', () => {
  let user_id: string;
  let token: string;
  let newNode = { ...addNode, node_id: '' };

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

    const { body } = await supertest(app)
      .post('/nodes/addNode')
      .send(addNode)
      .set('Authorization', token);
    console.log('Teste init');
    console.log(body);

    newNode = { ...newNode, node_id: body.node_id };
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const promise = await supertest(app)
      .put('/nodes/updateNode')
      .send({})
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ name: 'soils' })
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return type params error if received farm_id type not valid', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, farm_id: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('farm_id').message);
  });

  it('should be return type params error if received node_id type not valid', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, node_id: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('node_id').message);
  });

  it('should be return type params error if received node_num type not valid', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, node_num: 'type_not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('node_num').message
    );
  });

  it('should be return type params error if received is_gprs type not valid', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, is_gprs: 'type_not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('is_gprs').message);
  });

  it('should be return node database error if not exits user in db', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, node_id: 'invalid_node_id' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DatabaseErrorReturn().message);
  });

  it('should be return node does not exists if not exits user in db', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...newNode, node_id: uuidGlobal })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Node').message);
  });

  it('should be error if objects equals', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...addNode, node_id: newNode.node_id })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsEquals().message);
  });

  it('should be return a status 201 and a user-response data valids with request call with params válids', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({ ...addNode, node_id: newNode.node_id, node_num: 8 })
      .set('Authorization', token);

    expect(status).toBe(201);

    expect(body).toHaveProperty('farm_id', addFarms.farm_id);
    expect(body).toHaveProperty('node_id', newNode.node_id);
    expect(body).toHaveProperty('node_num', 8);
    expect(body).toHaveProperty('is_gprs', addNode.is_gprs);
    expect(body).toHaveProperty('gateway', null);
  });

  it('should changed type node', async () => {
    const { status, body } = await supertest(app)
      .put('/nodes/updateNode')
      .send({
        ...addNode,
        node_id: newNode.node_id,
        is_gprs: false,
        gateway: '192.100.100'
      })
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('gateway', '192.100.100');
  });
});
