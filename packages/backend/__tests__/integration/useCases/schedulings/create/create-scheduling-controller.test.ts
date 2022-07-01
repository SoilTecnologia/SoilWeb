import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import {
  DataNotFound,
  ParamsNotExpected,
  TypeParamError
} from '@root/protocols/errors';
import {
  createNode,
  createPivot
} from '@tests/mocks/data/global/createDatasDb';
import { addScheduling } from '@tests/mocks/data/schedulings';
import { addPivot } from '@tests/mocks/data/pivots';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

describe('Create Farms Integration', () => {
  let token: string;
  let user_id: string;

  beforeAll(async () => {
    await knex.migrate.down();
    await knex.migrate.latest();
    await createNode();

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

  it('should be return 400 and error params inválid if to have param null', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({})
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, name: 'soil' })
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return type params error if received timestamp  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, timestamp: true })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('timestamp').message
    );
  });

  it('should be return type params error if received start_timestamp  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, start_timestamp: true })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('start_timestamp').message
    );
  });

  it('should be return type params error if received author  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: true })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('author').message);
  });

  it('should be return type params error if received pivot_id  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, pivot_id: true })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('pivot_id').message
    );
  });

  it('should be return type params error if received is_stop  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, is_stop: 'not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('is_stop').message);
  });

  it('should be return type params error if received power  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, power: 'not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('power').message);
  });

  it('should be return type params error if received water  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, water: 'not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('water').message);
  });

  it('should be return type params error if received direction  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, direction: 43 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('direction').message
    );
  });

  it('should be return type params error if received percentimeter  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, percentimeter: 'not_valid' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('percentimeter').message
    );
  });

  it('should be return type params error if received end_timestamp  type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, end_timestamp: true })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('end_timestamp').message
    );
  });

  it('should be return error if not exists pivot_id received', async () => {
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, author: user_id, pivot_id: 'not_exists' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('Pivot').message);
  });

  it('should be return a status 201 and a new farm', async () => {
    await createPivot();
    const { status, body } = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({
        ...addScheduling,
        author: user_id
      })
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('pivot_id', addPivot.pivot_id);
    expect(body).toHaveProperty('scheduling_id');
    expect(body).toHaveProperty('percentimeter', addScheduling.percentimeter);
    expect(body).toHaveProperty('direction', addScheduling.direction);
    expect(body).toHaveProperty('power', addScheduling.power);
    expect(body).toHaveProperty('water', addScheduling.water);
    expect(body).toHaveProperty('is_stop', addScheduling.is_stop);
    expect(body).toHaveProperty('start_timestamp');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('end_timestamp');
  });
});
