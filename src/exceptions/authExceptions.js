class AuthExceptionExpiredError extends Error {
  constructor(message = "Token has expired, try logging in again") {
    super(message);
    this.name = "AuthExceptionExpiredError";
    this.status = 401;
  }
}

class AuthExceptionInvalidToken extends Error {
  constructor(message = "Invalid token") {
    super(message);
    this.name = "AuthExceptionInvalidToken";
    this.status = 401;
  }
}

class AuthExceptionInvalidCredentials extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
    this.name = "AuthExceptionInvalidCredentials";
    this.status = 401;
  }
}

class AuthExceptionMissingToken extends Error {
  constructor(message = "No token provided") {
    super(message);
    this.name = "AuthExceptionMissingToken";
    this.status = 401;
  }
}

export {
  AuthExceptionExpiredError,
  AuthExceptionInvalidToken,
  AuthExceptionInvalidCredentials,
  AuthExceptionMissingToken
};
