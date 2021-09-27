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
		super(400, `Row with same unique identifier '${identifier}' already exists!`);

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