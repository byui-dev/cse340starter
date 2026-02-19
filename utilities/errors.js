// AppError: structured operational errors
// Purpose: Create consistent errors controllers can throw for centralized handling in error middleware

class AppError extends Error {
    constructor(status = 500, message = 'Server Error', operational = true) {
        super(message);
        this.status = status;
        this.isOperational = operational; // Flag to identify operational errors
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;