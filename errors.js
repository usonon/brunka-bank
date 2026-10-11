export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ValidationError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}

export class AuthError extends HttpError {
  constructor(message = 'Authentication required') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict') {
    super(409, message);
  }
}

export class RateLimitError extends HttpError {
  constructor(message = 'Too many requests') {
    super(429, message);
  }
}
