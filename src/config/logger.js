const winston = require('winston');

// Custom format for error handling
const enumErrorFormat = winston.format((info) => {
    if (info.stack) {
        // Include stack trace in the log message for errors
        Object.assign(info, { message: info.stack });
    }
    return info;
});

// Create logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info', // Dynamic log level
    format: winston.format.combine(
        enumErrorFormat(),
        process.env.NODE_ENV === 'development'
            ? winston.format.colorize() // Add colors in development
            : winston.format.uncolorize(), // Remove colors in production
        winston.format.splat(), // Allow string interpolation
        winston.format.printf(({ level, message }) => {
            return `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            stderrLevels: ['error'], // Print error-level logs to stderr
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }), // Log all levels to file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a separate file
    ],
});

// Export the logger for reuse
module.exports = logger;