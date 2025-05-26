/**
 * Logger utility for Gemini SDK. Supports debug/info/warn/error logging.
 * Enable by setting Logger.enabled = true or GEMINI_SDK_DEBUG=1.
 */
export declare class Logger {
    /**
     * Whether logging is enabled. Set via GEMINI_SDK_DEBUG=1 or manually.
     */
    static enabled: boolean;
    /**
     * Log a debug message.
     * @param args Arguments to log
     */
    static debug(...args: unknown[]): void;
    /**
     * Log an info message.
     * @param args Arguments to log
     */
    static info(...args: unknown[]): void;
    /**
     * Log a warning message.
     * @param args Arguments to log
     */
    static warn(...args: unknown[]): void;
    /**
     * Log an error message.
     * @param args Arguments to log
     */
    static error(...args: unknown[]): void;
}
/**
 * Base error class for all Gemini SDK errors.
 */
export declare class GeminiError extends Error {
    cause?: unknown | undefined;
    constructor(message: string, cause?: unknown | undefined);
}
/**
 * Error thrown for Gemini API failures.
 */
export declare class GeminiApiError extends GeminiError {
    constructor(message: string, cause?: unknown);
}
/**
 * Error thrown for file upload/processing failures.
 */
export declare class FileProcessingError extends GeminiError {
    constructor(message: string, cause?: unknown);
}
/**
 * Error thrown for invalid arguments or validation failures.
 */
export declare class ValidationError extends GeminiError {
    constructor(message: string, cause?: unknown);
}
