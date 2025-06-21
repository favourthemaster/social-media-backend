
class ApiError extends Error {
    constructor({statusCode, message, code}) {
        super(message); // Call the parent class constructor with the message
        this.statusCode = statusCode; // Set the status code
        this.code = code;
        this.message = message; // Set the error message
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

module.exports = ApiError;
