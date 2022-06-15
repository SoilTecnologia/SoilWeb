import "reflect-metadata"
import { mock, MockProxy } from "jest-mock-extended"
import { AlreadyExistsError, DatabaseErrorReturn, FailedCreateDataError } from '../../../../../src/protocols/errors'
import { UserModel } from '../../../../../src/database/model/User'
import { CreateUserUseCase } from '../../../../../src/useCases/User/CreateUser/CreateUserUseCase'
import { ICreateUserRepository, ICreateUserUseCase } from '../../../../../src/database/protocols/users/create-user/create-user'
import { IEncrypter } from '../../../../../src/useCases/User/utils/encrypted-password/protocols'
import { ITokenJwt } from '../../../../../src/useCases/User/utils/token-jwt/protocols'
import { messageErrorTryAction } from '../../../../../src/utils/types'

jest.mock("../../../../../src/utils/types")

describe("Create User Use Case",()=> {
  let userRepository: MockProxy<ICreateUserUseCase.Dependencies>
  let encrypter: MockProxy<IEncrypter>
  let token: MockProxy<ITokenJwt>
  let createUserService: ICreateUserUseCase
  let addUser: ICreateUserUseCase.Params
  let addUserEncrypted: ICreateUserRepository.Params
  let responseUser: ICreateUserUseCase.Response
  let userCreated: UserModel

  beforeEach(() => {
    userRepository = mock()
    encrypter = mock()
    token = mock()

    createUserService = new CreateUserUseCase(token,encrypter, userRepository)

    addUser = {login: "soil", password: "123456", user_type: "SUDO"}
    addUserEncrypted = {...addUser, password:"password_encrypted" }
    responseUser = {user_id: "soiltech", user_type: "SUDO", token: "soiltech"}
    userCreated = {user_id: "soiltech", login: "soil", password: "123456", user_type: "SUDO"}

    userRepository.findUserByLogin.mockResolvedValue(undefined)
    userRepository.create.mockResolvedValue(userCreated)
    encrypter.encrypt.mockResolvedValue("password_encrypted")
    token.create.mockResolvedValue("token_valid")

    jest.fn(messageErrorTryAction)
  })

  // Test received data corrects 
  it("should to have been called with params válids and called once time",
   async () => {
    const callUser = jest.spyOn(createUserService, "execute")
    createUserService.execute(addUser)

    expect(callUser).toHaveBeenCalledWith(addUser)
    expect(callUser).toBeCalledTimes(1)
  })  

   // Tests encrypted password response
  it("should encrypted password to have been called with data valids to have called once time",
   async () => {
    const fnEncrypted = jest.spyOn(encrypter, "encrypt")

    await createUserService.execute(addUser)

    expect(fnEncrypted).toHaveBeenCalledWith("123456")
    expect(fnEncrypted).toBeCalledTimes(1)

    })

  it("should encrypted password return password encrypted ",
   async () => {
    const callUserCreated = jest.spyOn(userRepository, "create")
    await createUserService.execute(addUser)

    expect(callUserCreated).toHaveBeenCalledWith({...addUser, password:"password_encrypted" })
  })

  // Tests created user in database response
  it("should create user repository to have been called with data valids to have called once time",
    async () => {
    const fnEncrypted = jest.spyOn(userRepository, "create")

    await createUserService.execute(addUser)

    expect(fnEncrypted).toHaveBeenCalledWith(addUserEncrypted)
    expect(fnEncrypted).toBeCalledTimes(1)
  })

  it("should find user repository to have been called with data valids to have called once time",
    async () => {
    const fnEncrypted = jest.spyOn(userRepository, "findUserByLogin")

    await createUserService.execute(addUser)

    expect(fnEncrypted).toHaveBeenCalledWith("soil")
    expect(fnEncrypted).toBeCalledTimes(1)
  })

  it("should to throw error if user is not created in database",
   async () => {
    userRepository.create.mockResolvedValueOnce(undefined)

    const err = createUserService.execute(addUser)

    expect(err).rejects.toThrow(new FailedCreateDataError("User"))
  })

  it("should to throw error if user received already exists in database",
   async () => {
    userRepository.findUserByLogin.mockResolvedValueOnce( {
        user_id: "soil_id", login: "soil", password: "123456", user_type: "SUDO"
      })

    const err = createUserService.execute(addUser)

    expect(err).rejects.toThrow(new AlreadyExistsError("User"))
  })

  //Tests Jwt Token response

  it("should create jwt to have been called with data valids and to have called once time",
   async () => {
    const fnToken = jest.spyOn(token, "create")

    await createUserService.execute(addUser)

    expect(fnToken).toHaveBeenCalledWith(userCreated)
    expect(fnToken).toBeCalledTimes(1)
  })

  it("should to have created token with data valids", async () => {
    jest.spyOn(token, "create").mockResolvedValueOnce("soiltech")

    const value = await createUserService.execute(addUser)

    expect(value).toHaveProperty("token", "soiltech")
  })

  it("should throw error with token return null ",  () => {
    jest.spyOn(token, "create").mockResolvedValueOnce(null)

    const promise = createUserService.execute(addUser)
    expect(promise).rejects.toThrow(new Error("Does not create token jwt"))
  })

  //Test response useCases
  it("should return error if ocurred error created token", () => {
    jest.spyOn(token, "create").mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser)
    expect(promise).rejects.toThrow();

  })

  it("Should received an error if encrypted throw a error", () => {
    jest.spyOn(encrypter, "encrypt").mockRejectedValueOnce(new Error());

    const promise = createUserService.execute(addUser)
    expect(promise).rejects.toThrow();
  });

  it("should throw database error, when repository create return error", () => {
    jest.spyOn(userRepository, "create").mockRejectedValueOnce(new Error())

    const promise =  createUserService.execute(addUser)
    expect(promise).rejects.toThrow(new DatabaseErrorReturn())
    
  })

  it("should throw database error, when repository findUserByLogin return error", () => {

    jest.spyOn(userRepository, "findUserByLogin").mockRejectedValueOnce(new Error())
    const promise =  createUserService.execute(addUser)

    expect(promise).rejects.toThrow(new DatabaseErrorReturn())
    
  })


})