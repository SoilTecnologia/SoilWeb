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
import {
  createNode,
  createPivot
} from '@tests/mocks/data/global/createDatasDb';
import {
  addScheduling,
  newScheduling,
  putScheduling
} from '@tests/mocks/data/schedulings';
import { SchedulingModel } from '@root/database/model/Scheduling';
import { IUpdateSchedulingService } from '@root/useCases/contracts/scheduling';
import dayjs from 'dayjs';
import { addPivot } from '@tests/mocks/data/pivots';
import { SchedulingHistoryModel } from '@root/database/model/SchedulingHistory';
import { dateString } from '@root/utils/convertTimeZoneDate';
import { dateToFormat } from '@tests/mocks/data/global/date';

describe('Update Farm Integration', () => {
  let user_id: string;
  let token: string;
  let newFarm: FarmModel;

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

  it('should be return 400 and token Invalid message', async () => {
    const { status, text } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .set('Authorization', 'abc');

    expect(status).toBe(401);
    expect(text).toBe('Invalid Token!');
  });

  it('should be return 400 and error params invalid', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({})
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsInvalid().message);
  });

  it('should be return 400 and error params not expected if to received more params in the body', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...newScheduling, name: 'ko' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new ParamsNotExpected().message);
  });

  it('should be return 400 and scheduling_id type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, scheduling_id: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('scheduling_id').message
    );
  });
  it('should be return 400 and pivot_id type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, pivot_id: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('pivot_id').message
    );
  });

  it('should be return 400 and author type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, author: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('author').message);
  });

  it('should be return 400 and direction type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, direction: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('direction').message
    );
  });

  it('should be return 400 and is_stop type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, is_stop: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('is_stop').message);
  });

  it('should be return 400 and power type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, power: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('power').message);
  });

  it('should be return 400 and water type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, water: 45 })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty('error', new TypeParamError('water').message);
  });

  it('should be return 400 and percentimeter type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, percentimeter: 'not_a_number' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('percentimeter').message
    );
  });

  it('should be return 400 and start_timestamp type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, start_timestamp: 'not_date' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('start_timestamp').message
    );
  });

  it('should be return 400 and end_timestamp type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, end_timestamp: 'not_date' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('end_timestamp').message
    );
  });

  it('should be return 400 and update_timestamp type error idf not received a string', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling, update_timestamp: 'not_date' })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new TypeParamError('update_timestamp').message
    );
  });

  it('should be return 400 ans scheduling not found if not exists scheduling in db', async () => {
    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({ ...putScheduling })
      .set('Authorization', token);

    expect(status).toBe(400);
    expect(body).toHaveProperty(
      'error',
      new DataNotFound('Scheduling').message
    );
  });

  it('should be return 201 and and scheduling is running if update timestamp is after start_timestamp', async () => {
    await createPivot();
    const response = await knex('schedulings')
      .insert({
        ...addScheduling,
        author: user_id,
        pivot_id: addPivot.pivot_id
      })
      .returning('*');

    const start_timestamp = dayjs(response[0].start_timestamp);
    const update_timestamp = dayjs(start_timestamp).add(30, 'minute');

    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({
        ...putScheduling,
        scheduling_id: response[0].scheduling_id,
        update_timestamp
      })
      .set('Authorization', token);
    expect(status).toBe(201);
    expect(body).toHaveProperty('message', 'scheduling is running');
  });

  it('should be return 201 and return a scheduling created', async () => {
    await createPivot();
    const response = await knex('schedulings')
      .insert({
        ...addScheduling,
        author: user_id,
        pivot_id: addPivot.pivot_id
      })
      .returning('*');

    const start_timestamp = dayjs(response[0].start_timestamp);
    const update_timestamp = dayjs(start_timestamp).subtract(6, 'hour');

    const { status, body } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({
        ...putScheduling,
        scheduling_id: response[0].scheduling_id,
        update_timestamp
      })
      .set('Authorization', token);
    expect(status).toBe(201);
    expect(body).toHaveProperty('scheduling_id', response[0].scheduling_id);
  });

  it('should be return 201 to have created a new scheduling history with attribute updated equal scheduling_id', async () => {
    await knex('schedulings').select('*').del();
    await knex('scheduling_historys').select('*').del();

    await createPivot();

    const response = await supertest(app)
      .post('/schedulings/addScheduling')
      .send({ ...addScheduling, pivot_id: addPivot.pivot_id, author: user_id })
      .set('Authorization', token);

    const start_timestamp = dayjs(response.body.start_timestamp);
    const update_timestamp = dayjs(start_timestamp).subtract(6, 'hour');

    const { body, status } = await supertest(app)
      .put('/schedulings/updateScheduling')
      .send({
        ...putScheduling,
        scheduling_id: response.body.scheduling_id,
        update_timestamp
      })
      .set('Authorization', token);

    const dataScheHist = await knex<SchedulingHistoryModel>(
      'scheduling_historys'
    )
      .select('*')
      .where({ updated: body.scheduling_id })
      .first();

    expect(dataScheHist?.updated).toBe(body?.scheduling_id);
  });
});
