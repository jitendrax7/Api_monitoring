

/**
 * Custom error class for handling application-specific errors.
 * This class extends the built-in Error class and adds additional properties for better error handling.
 * It can be used to create errors that are specific to the application, with a status code and optional error details.
 */
class AppError extends Error {
    constructor(message, statusCode= 500, errors= null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true; // Mark this error as operational (expected) for better error handling
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace for better debugging
    }
}


export default AppError;