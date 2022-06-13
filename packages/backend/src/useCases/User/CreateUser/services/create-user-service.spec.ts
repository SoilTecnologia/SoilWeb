import "reflect-metadata"
import { container, delay } from 'tsyringe'
import knex from '../../../../database'
import { UserModel } from '../../../../database/model/User'
import { AddNewUserRepository } from '../../../../database/repositories/Users/AddUser/AddNewUserRepository'
import { IAddNewUser } from '../../../../database/repositories/Users/AddUser/IAddNewUser'
import { IFindByLogin } from '../../../../database/repositories/Users/FindByLogin/IFindByLoginRepository'
import { IUsersRepository, ResponseDTO } from '../../../../database/repositories/Users/IUsersRepository'
import { UsersRepository } from '../../../../database/repositories/Users/UserRepository'
import { AddUserModel, ICreateUserUseCase, UserResponse } from '../protocols/ICreateUser'
import { CreateUserUseCase } from './CreateUserUseCase'

beforeAll(async () => {
  await knex.migrate.latest()
})

afterAll(async () => {
  await knex.migrate.rollback()
  await knex.migrate.down()
})

class AddAccountRepositoryStub implements IAddNewUser {
    async create(newUser: AddUserModel): Promise<UserModel> {
      return {
        user_id: "valid_id",
        ...newUser
      }
    }
}

class FindUsertByLoginRepositoryStub implements IFindByLogin{
  async findByLogin(login: string): Promise<UserModel | undefined> {
    return undefined
  }
}

const makeRepository = new FindUsertByLoginRepositoryStub()
const makeIAddUserRepository = new AddAccountRepositoryStub()
const makeSut = new CreateUserUseCase(makeIAddUserRepository , makeRepository)

describe("Create User Use Case",()=> {

  it("should create a new user with params válids", async () => {

    const callUser = jest.spyOn(makeSut, "execute")
    const user: AddUserModel = {login: "henrique", password: "123456", user_type: "SUDO"}
    makeSut.execute(user)
    expect(callUser).toHaveBeenCalledWith(user)
  })
})