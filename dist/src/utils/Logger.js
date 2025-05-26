/**
 * Logger utility for Gemini SDK. Supports debug/info/warn/error logging.
 * Enable by setting Logger.enabled = true or GEMINI_SDK_DEBUG=1.
 */
export class Logger {
    /**
     * Whether logging is enabled. Set via GEMINI_SDK_DEBUG=1 or manually.
     */
    static enabled = process.env.GEMINI_SDK_DEBUG === '1' || false;
    /**
     * Log a debug message.
     * @param args Arguments to log
     */
    static debug(...args) {
        if (Logger.enabled)
            console.debug('[GeminiSDK][DEBUG]', ...args);
    }
    /**
     * Log an info message.
     * @param args Arguments to log
     */
    static info(...args) {
        if (Logger.enabled)
            console.info('[GeminiSDK][INFO]', ...args);
    }
    /**
     * Log a warning message.
     * @param args Arguments to log
     */
    static warn(...args) {
        if (Logger.enabled)
            console.warn('[GeminiSDK][WARN]', ...args);
    }
    /**
     * Log an error message.
     * @param args Arguments to log
     */
    static error(...args) {
        if (Logger.enabled)
            console.error('[GeminiSDK][ERROR]', ...args);
    }
}
/**
 * Base error class for all Gemini SDK errors.
 */
export class GeminiError extends Error {
    cause;
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'GeminiError';
        if (cause)
            this.stack += '\nCaused by: ' + (cause.stack || cause);
    }
}
/**
 * Error thrown for Gemini API failures.
 */
export class GeminiApiError extends GeminiError {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'GeminiApiError';
    }
}
/**
 * Error thrown for file upload/processing failures.
 */
export class FileProcessingError extends GeminiError {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'FileProcessingError';
    }
}
/**
 * Error thrown for invalid arguments or validation failures.
 */
export class ValidationError extends GeminiError {
    constructor(message, cause) {
        super(message, cause);
        this.name = 'ValidationError';
    }
}
