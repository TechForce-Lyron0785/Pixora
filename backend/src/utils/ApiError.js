class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
    data = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data; // For passing back any relevant data
    this.errors = errors; // For validation errors or detailed error info
    this.message = message;
    this.success = false;
    this.errorType = this.getErrorType(statusCode); // Add error type based on status code
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  getErrorType(statusCode) {
    switch(statusCode) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'VALIDATION_ERROR';
      case 429:
        return 'TOO_MANY_REQUESTS';
      case 500:
        return 'INTERNAL_SERVER';
      default:
        return 'SERVER_ERROR';
    }
  }
}

export { ApiError };
