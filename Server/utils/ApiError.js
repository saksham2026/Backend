class ApiError extends Error {
  constructor(
    statusCode,
    message = " Default message in ApiError",
    error,
    data = {},
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = this.message;
    this.success = false;
    (this.data = null), (this.error = error);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
