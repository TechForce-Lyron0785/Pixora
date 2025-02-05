import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (err) {
      // Convert error to ApiError if not already
      const apiError = err instanceof ApiError 
        ? err 
        : new ApiError(
            err.statusCode || 500,
            err.message || "Internal Server Error",
            err.errors || [],
            err.stack
          );

      // Send error response
      res.status(apiError.statusCode).json({
        success: false,
        message: apiError.message,
        errors: apiError.errors,
        errorType: apiError.errorType,
        ...(process.env.NODE_ENV === "development" && {stack: apiError.stack})
      });
    }
  };
};

export { asyncHandler };
