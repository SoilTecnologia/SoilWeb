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
import { uuidGlobal } from '@tests/mocks/data/global';
import { FarmModel } from '@root/database/model/Farm';

describe('Update Farm Integration', () => {
  let user_id: string;
  let token: string;
  let newFarm: FarmModel;

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

    newFarm = { ...addFarms, user_id };

    await knex('farms').insert(newFarm);
  });

  afterAll(async () => {
    await knex.migrate.down();
    await knex.destroy();
  });

  it('should be return 400 and error params inválid if to have param null', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({})
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 401 if received token invalid', async () => {
    const { status, text } = await supertest(app)
      .put('/farms/updateFarm')
      .send({ name: 'soils' })
      .set('Authorization', 'abcde');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 and error if to have received params not expected', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, name: 'soil' })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new ParamsNotExpected().message
    );
  });

  it('should be return type params error if received user_id type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, user_id: 32 })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('user_id').message
    );
  });

  it('should be return type params error if received farm_id type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, farm_id: 32 })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('farm_id').message
    );
  });

  it('should be return type params error if received farm_name type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, farm_name: 32 })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('farm_name').message
    );
  });

  it('should be return type params error if received farm_city type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, farm_city: 32 })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('farm_city').message
    );
  });

  it('should be return type params error if received farm_lat type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, farm_lat: 'lat_invalid' })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('farm_lat').message
    );
  });

  it('should be return type params error if received farm_lng type not valid', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, farm_lng: 'lng_invalid' })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new TypeParamError('farm_lng').message
    );
  });

  it('should be return user does not found if not exits user in db', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...addFarms, user_id: uuidGlobal })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new DataNotFound('User').message
    );
  });

  it('should be return farm does not found if not exits user in db', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send({ ...newFarm, farm_id: 'farm_id_invalid' })
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      new DataNotFound('Farm').message
    );
  });

  it('should be error if objects equals', async () => {
    const promise = await supertest(app)
      .put('/farms/updateFarm')
      .send(newFarm)
      .set('Authorization', token);

    expect(promise.status).toBe(400);
    expect(promise.body).toHaveProperty(
      'error',
      'New Farm is Strict Equals a Old Farms, Not Updated...'
    );
  });

  it('should be return a status 201 and a user-response data valids with request call with params válids', async () => {
    const { body, status } = await supertest(app)
      .put('/farms/updateFarm')
      .send({
        ...newFarm,
        farm_name: 'new_farm_name'
      })
      .set('Authorization', token);

    expect(status).toBe(200);
    expect(body).toHaveProperty('farm_name', 'new_farm_name');
    expect(body).toHaveProperty('user_id', user_id);
    expect(body).toHaveProperty('farm_id', newFarm.farm_id);
    expect(body).toHaveProperty('farm_city', newFarm.farm_city);
    expect(body).toHaveProperty('farm_lat', newFarm.farm_lat);
    expect(body).toHaveProperty('farm_lng', newFarm.farm_lng);
  });
});
