export class DuplicateUniqueError extends Error {
  // Normal signature with defaults
  constructor(identifier: string) {
		super();
		this.message = `Row with same unique identifier '${identifier}' already exists!`
    this.name = "DuplicateUniqueError"
  }
}