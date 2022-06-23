import '@root/shared/container/index';
import { IDeleteUserRepo, IFindUserByIdRepo } from '@root/database/protocols';
import { mock, MockProxy } from 'jest-mock-extended';
import { DatabaseErrorReturn, DataNotFound } from '@root/protocols/errors';
import { IDeleteUserService } from '@root/useCases/contracts';
import { DeleteUserUseCase } from '@root/useCases/data';
import { userCreated } from '@tests/mocks/data/users/user-values-for-mocks';

describe('Delete User Service', () => {
  let findUser: MockProxy<IFindUserByIdRepo>;
  let delUser: MockProxy<IDeleteUserRepo>;
  let deleteUserService: IDeleteUserService;
  const user_id = 'soiltech';

  beforeAll(async () => {
    findUser = mock();
    delUser = mock();

    deleteUserService = new DeleteUserUseCase(findUser, delUser);

    findUser.findById.mockResolvedValue(userCreated);
    delUser.deleteUser.mockResolvedValue(1);
  });

  // Teste params received
  it('should delete user usecase to have been calle with params correctly ', () => {
    const spyService = jest.spyOn(deleteUserService, 'execute');

    deleteUserService.execute({ user_id });

    expect(spyService).toHaveBeenCalledWith({ user_id: 'soiltech' });
  });
  // Tests return databse

  it('should findUser to have been called with params correctly ', async () => {
    const fnFindUser = jest.spyOn(findUser, 'findById');

    await deleteUserService.execute({ user_id });

    expect(fnFindUser).toHaveBeenCalledWith({ id: 'soiltech' });
  });

  it('should return error if not exists user in database ', () => {
    jest.spyOn(findUser, 'findById').mockResolvedValueOnce(undefined);

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DataNotFound('User'));
  });

  it('should return error if database return a error ', () => {
    jest.spyOn(findUser, 'findById').mockRejectedValueOnce(new Error(''));

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  //Tests return Database DeleteUser

  it('should findUser to have been called with params correctly ', async () => {
    const fnDelUser = jest.spyOn(delUser, 'deleteUser');

    await deleteUserService.execute({ user_id });

    expect(fnDelUser).toHaveBeenCalledWith({ user_id: 'soiltech' });
  });

  it('should return error if delete user database return a error ', () => {
    jest.spyOn(delUser, 'deleteUser').mockRejectedValueOnce(new Error(''));

    const promise = deleteUserService.execute({ user_id });

    expect(promise).rejects.toThrow(new DatabaseErrorReturn());
  });

  // Return final

  it('should return error if not response delete user ', async () => {
    jest.spyOn(delUser, 'deleteUser').mockResolvedValueOnce(undefined);

    const promise = await deleteUserService.execute({ user_id });

    expect(promise).toHaveProperty('status', 'FAIL');
  });

  it('should return status ok if user deleted with sucessfully ', async () => {
    const promise = await deleteUserService.execute({ user_id });

    expect(promise).toHaveProperty('status', 'OK');
  });
});
