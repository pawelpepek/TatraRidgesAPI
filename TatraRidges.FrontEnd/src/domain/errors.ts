class DomainError extends Error {
	constructor(message: string) {
		super(message)
		this.name = new.target.name
		// Keeps `instanceof` working when classes are transpiled to ES5.
		Object.setPrototypeOf(this, new.target.prototype)
	}
}

export class NotFoundError extends DomainError {}

export class InvalidCoordinateError extends DomainError {}

export class CyclicRidgeError extends DomainError {
	constructor() {
		super(
			"Nie mozna zapisać takiego połączenia ponieważ powoduje zapętlenie grani!"
		)
	}
}
