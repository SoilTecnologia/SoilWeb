import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';
import { IFindFarmByIdRepo } from '@root/database/protocols';
import { FindFarmByIdRepo } from '@root/database/repositories';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Find Farm By Id Repository', () => {
  let tracker: Tracker;
  let findfarm: IFindFarmByIdRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    findfarm = new FindFarmByIdRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.select('farms').responseOnce([addFarms]);
    await findfarm.find({ farm_id: addFarms?.farm_id });

    const insertHistory = tracker.history.select;

    expect(insertHistory[0].method).toEqual('select');
    expect(insertHistory[0].bindings).toStrictEqual([addFarms.farm_id, 1]);
  });

  it('should received a new farm of response database ', async () => {
    tracker.on.select('farms').responseOnce([addFarms]);
    const promise = await findfarm.find({ farm_id: addFarms?.farm_id });

    expect(promise?.farm_id).toBe(addFarms.farm_id);
    expect(promise?.user_id).toBe(addFarms.user_id);
    expect(promise?.farm_name).toBe(addFarms.farm_name);
    expect(promise?.farm_city).toBe(addFarms.farm_city);
    expect(promise?.farm_lat).toBe(addFarms.farm_lat);
    expect(promise?.farm_lng).toBe(addFarms.farm_lng);
  });

  it('should throw error if database error', () => {
    tracker.on.insert('users').simulateErrorOnce('database error');
    const response = findfarm.find({ farm_id: addFarms?.farm_id });

    expect(response).rejects.toThrow();
  });
});
