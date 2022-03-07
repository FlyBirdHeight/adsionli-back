import ApplicationError from "../../lib/error.js";
class ConnectError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get statusCode() {
        return 1000;
    }
}

export default ConnectError;