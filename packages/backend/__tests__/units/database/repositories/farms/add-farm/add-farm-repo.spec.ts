import 'reflect-metadata';
import knex from 'knex';
import { getTracker, MockClient, Tracker } from 'knex-mock-client';
import { ICreateFarmRepo } from '@root/database/protocols/farms/create-farms/create-farms-protocol';
import { CreateFarmRepo } from '@root/database/repositories/Farms/Create/CreateFarmRepo';
import { addFarms } from '@tests/mocks/data/farms/farms-values-mock';

jest.mock('@database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Add Farm Repository', () => {
  let tracker: Tracker;
  let addFarmRepo: ICreateFarmRepo;

  beforeAll(() => {
    tracker = getTracker();
  });

  beforeEach(() => {
    addFarmRepo = new CreateFarmRepo();
  });

  afterEach(() => {
    tracker.reset();
  });

  it('should query builder to have called with params correct ', async () => {
    tracker.on.insert('farms').responseOnce([addFarms]);
    await addFarmRepo.create(addFarms);

    const insertHistory = tracker.history.insert;

    expect(insertHistory[0].method).toEqual('insert');
    expect(insertHistory[0].bindings).toStrictEqual([
      addFarms.farm_city,
      addFarms.farm_id,
      addFarms.farm_lat,
      addFarms.farm_lng,
      addFarms.farm_name,
      addFarms.user_id
    ]);
  });

  it('should received a new farm of response database ', async () => {
    tracker.on.insert('farms').responseOnce([addFarms]);
    const promise = await addFarmRepo.create(addFarms);

    expect(promise?.farm_id).toBe(addFarms.farm_id);
    expect(promise?.user_id).toBe(addFarms.user_id);
    expect(promise?.farm_name).toBe(addFarms.farm_name);
    expect(promise?.farm_city).toBe(addFarms.farm_city);
    expect(promise?.farm_lat).toBe(addFarms.farm_lat);
    expect(promise?.farm_lng).toBe(addFarms.farm_lng);
  });

  it('should throw error if database error', () => {
    tracker.on.insert('users').simulateErrorOnce('database error');
    const response = addFarmRepo.create(addFarms);

    expect(response).rejects.toThrow();
  });
});
