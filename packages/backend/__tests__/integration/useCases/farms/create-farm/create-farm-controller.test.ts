import supertest from 'supertest';
import '@root/shared/container/index';
import knex from '@root/database';
import { app } from '@root/app';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { addUser } from '@tests/mocks/data/users/user-values-for-mocks';
import { UserResponseData } from '@root/useCases/contracts/users/create-user/create-user-protocol';
import { uuidGlobal } from '@tests/mocks/data/global';
import { DataNotFound } from '@root/protocols/errors';

describe('Create Farms Integration', () => {
  let token: string;
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

  it('should be return 400 and error params inválid if to have param null', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({})
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', 'Params inválids');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, name: 'soil' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Received Params not expected`);
  });

  it('should be return error if token not valid', async () => {
    const { status, text } = await supertest(app)
      .post('/farms/addfarm')
      .send(addFarms)
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return type params error if received farm_id type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, farm_id: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid farm_id`);
  });

  it('should be return type params error if received user_id type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, user_id: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid user_id`);
  });

  it('should be return type params error if received farm_name type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, farm_name: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid farm_name`);
  });

  it('should be return type params error if received farm_city type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, farm_city: 32 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid farm_city`);
  });

  it('should be return type params error if received farm_lat type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, farm_lat: 'not_number' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid farm_lat`);
  });

  it('should be return type params error if received farm_lng type not valid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, farm_lng: 'not_number' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Type Data Inválid farm_lng`);
  });

  it('should be return farm already exists if exists farm in db', async () => {
    const farmSelect = await knex('farms')
      .select('*')
      .where({ farm_id: addFarms.farm_id })
      .first();

    if (!farmSelect) await knex('farms').insert({ ...addFarms, user_id });

    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, user_id })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', `Farm Already Exists`);

    await knex('farms').select('*').del();
  });

  it('should be return user does not exists if received user_id invalid', async () => {
    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, user_id: uuidGlobal })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new DataNotFound('User').message);
  });

  it('should be return a status 201 and a new farm', async () => {
    await knex('farms').select('*').del();

    const { status, body } = await supertest(app)
      .post('/farms/addfarm')
      .send({ ...addFarms, user_id })
      .set('Authorization', token);

    expect(status).toBe(201);
    expect(body).toHaveProperty('user_id', user_id);
    expect(body).toHaveProperty('farm_id', addFarms.farm_id);
    expect(body).toHaveProperty('farm_name', addFarms.farm_name);
    expect(body).toHaveProperty('farm_city', addFarms.farm_city);
    expect(body).toHaveProperty('farm_lat', addFarms.farm_lat);
    expect(body).toHaveProperty('farm_lng', addFarms.farm_lng);
  });
});
