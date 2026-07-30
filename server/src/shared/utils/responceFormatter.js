/**
 * ResponseFormatter - Utility class for formatting API responses in a consistent structure.
 * This class can be extended in the future to include additional response types or features as needed.
 */
class ResponseFormatter {
    /**
     * Formats a successful response with optional data and message.
     * @param {any} data - The data to include in the response (default: null)
     * @param {string} message - The message to include in the response (default: "Success")
     * @param {number} statusCode - The HTTP status code for the response (default: 200)
     * @returns {Object} - The formatted response object
     */
    static success( data= null,message= "success", statusCode= 200) {
        return {
            success: true,
            message,
            data,
            statusCode,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Formats an error response with optional message, status code, and errors.
     * @param {string} message - The message to include in the response (default: "error")
     * @param {number} statusCode - The HTTP status code for the response (default: 400)
     * @param {Array|null} errors - The list of errors to include in the response (default: null)
     * @returns {Object} - The formatted response object
     */

    static error(message= "error", statusCode= 400, errors= null) {
        return {
            success: false, 
            message,
            statusCode,
            errors,
            timestamp: new Date().toISOString()
        }
    }
}


export default ResponseFormatter;