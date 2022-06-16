import 'reflect-metadata';
import knex from 'knex';
import { MockClient } from 'knex-mock-client';

jest.mock('../../src/database/index', () => {
  return knex({ client: MockClient, dialect: 'pg' });
});

describe('Jest Config', () => {
  it('should be initialize jest with sucessfully ', () => {
    const initialize = 'Sucess';
    expect(initialize).toBe('Sucess');
  });
});
