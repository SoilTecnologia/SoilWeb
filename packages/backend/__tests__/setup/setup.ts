import { mockDecorators } from '@tests/mocks/data/global/decorators';
import 'reflect-metadata';

describe('Jest Config', () => {
  it('should be initialize jest with sucessfully ', () => {
    const initialize = 'Sucess';
    expect(initialize).toBe('Sucess');
  });
});
