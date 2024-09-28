/**
 * Creates a middleware wrapper for asynchronous route handlers
 * @param {Function} func - The asynchronous route handler function to be wrapped
 * @returns {Function} A new middleware function that catches any errors and passes them to the next middleware
 */
module.exports = func => {
    /**
     * Creates and returns an asynchronous middleware function.
     * @param {Function} func - The asynchronous function to be wrapped.
     * @returns {Function} A middleware function that catches any errors and passes them to the next middleware.
     */
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}