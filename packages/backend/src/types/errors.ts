export class DuplicateUniqueError extends Error {
  // Normal signature with defaults
  constructor(identifier: string) {
		super(`Row with same unique identifier '${identifier}' already exists!`);

    Object.setPrototypeOf(this, DuplicateUniqueError.prototype);
  }
}

export class InvalidCredentials extends Error {
  // Normal signature with defaults
  constructor() {
		super(`Invalid Credentials or user not found!`);

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