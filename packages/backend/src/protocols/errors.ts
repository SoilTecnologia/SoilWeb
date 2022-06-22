export class ServerError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;

    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class DuplicateUniqueError extends ServerError {
  // Normal signature with defaults
  constructor(identifier: string) {
    super(
      400,
      `Row with same unique identifier '${identifier}' already exists!`
    );

    Object.setPrototypeOf(this, DuplicateUniqueError.prototype);
  }
}

export class InvalidCredentials extends ServerError {
  // Normal signature with defaults
  constructor() {
    super(400, `Invalid Credentials or user not found!`);

    Object.setPrototypeOf(this, InvalidCredentials.prototype);
  }
}

export class InvalidRequestBody extends Error {
  // Normal signature with defaults
  constructor(identifiers?: string[]) {
    super(`Invalid data on request body: ${identifiers}`);

    Object.setPrototypeOf(this, InvalidRequestBody.prototype);
  }
}

export class ParamsNotExpected extends Error {
  // Normal signature with defaults
  constructor() {
    super('Received Params not expected');

    Object.setPrototypeOf(this, ParamsNotExpected.prototype);
  }
}

export class AlreadyExistsError extends Error {
  constructor(data: string) {
    super(`${data} Already Exists`);

    Object.setPrototypeOf(this, AlreadyExistsError.prototype);
  }
}

export class FailedCreateDataError extends Error {
  constructor(data: string) {
    super(`Failed in at created ${data}`);

    Object.setPrototypeOf(this, FailedCreateDataError.prototype);
  }
}

export class DatabaseErrorReturn extends Error {
  constructor() {
    super('Database Error');

    Object.setPrototypeOf(this, DatabaseErrorReturn.prototype);
  }
}

export class TypeParamError extends Error {
  constructor(value: string) {
    super(`Type Data Inválid ${value}`);

    Object.setPrototypeOf(this, TypeParamError.prototype);
  }
}

export class ParamsInvalid extends Error {
  constructor() {
    super(`Params inválids`);

    Object.setPrototypeOf(this, ParamsInvalid.prototype);
  }
}

export class DataNotFound extends Error {
  constructor(value: string) {
    super(`${value} Does not exists`);

    Object.setPrototypeOf(this, DataNotFound.prototype);
  }
}

export type DatabaseError = 'Database Error';
export const DATABASE_ERROR: DatabaseError = 'Database Error';
