export class ApiError  extends Error {
  constructor({ message, status, errors = {} }) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new AppiError({
      message,
      errors,
      status: 400,
    });
  }

  static unauthorized(message = 'Unauthorized user', errors) {
    return new AppiError({
      message,
      errors,
      status: 401,
    });
  }

  static notFound(errors) {
    return new AppiError({
      message: 'not found',
      errors,
      status: 404,
    });
  }
}
