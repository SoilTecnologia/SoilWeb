import '@root/shared/container/index';
import { IDeleteBaseRepo, IGetByIdBaseRepo } from '@root/database/protocols';
import { mock, MockProxy } from 'jest-mock-extended';
import {
  DatabaseErrorReturn,
  DATABASE_ERROR,
  DataNotFound
} from '@root/protocols/errors';
import { IDeleteUserService } from '@root/useCases/contracts';
import { DeleteUserUseCase } from '@root/useCases/data';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';
import { UserModel } from '@root/database/model/User';

describe('Delete User Service', () => {
  let findUser: MockProxy<IGetByIdBaseRepo>;
  let delUser: MockProxy<IDeleteBaseRepo>;
  let deleteUserService: IDeleteUserService;
  const user_id = 'soiltech';

  beforeAll(async () => {
    findUser = mock();
    delUser = mock();

    deleteUserService = new DeleteUserUseCase(findUser, delUser);

    findUser.get.mockResolvedValue(userCreated);
    delUser.del.mockResolvedValue(1);
  });

  // Teste params received
  it('should delete user usecase to have been calle with params correctly ', () => {
    const spyService = jest.spyOn(deleteUserService, 'execute');

    deleteUserService.execute({ user_id });

    expect(spyService).toHaveBeenCalledWith({ user_id: 'soiltech' });
  });
  // Tests return databse

  it('should findUser to have been called with params correctly ', async () => {
    const fnFindUser = jest.spyOn(findUser, 'get');

    await deleteUserService.execute({ user_id });

    expect(fnFindUser).toHaveBeenCalledWith({
      table: 'users',
      column: 'user_id',
      id: 'soiltech'
    });
  });

  it('should return error if not exists user in database ', () => {
    jest.spyOn(findUser, 'get').mockResolvedValueOnce(undefined);

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  it('should return error if database return a error ', () => {
    jest.spyOn(findUser, 'get').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  //Tests return Database DeleteUser

  it('should findUser to have been called with params correctly ', async () => {
    const fnDelUser = jest.spyOn(delUser, 'del');

    await deleteUserService.execute({ user_id });

    expect(fnDelUser).toHaveBeenCalledWith({
      table: 'users',
      column: 'user_id',
      data: 'soiltech'
    });
  });

  it('should return error if delete user database return a error ', () => {
    jest.spyOn(delUser, 'del').mockResolvedValueOnce(DATABASE_ERROR);

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // Return final

  it('should return error if not response delete user ', async () => {
    jest.spyOn(delUser, 'del').mockResolvedValueOnce(undefined);

    const promise = await deleteUserService.execute({ user_id });

    expect(promise).toHaveProperty('status', 'FAIL');
  });

  it('should return status ok if user deleted with sucessfully ', async () => {
    const promise = await deleteUserService.execute({ user_id });

    expect(promise).toHaveProperty('status', 'OK');
  });
});
