import ApplicationError from "../../lib/error";

export default class ConnectError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get statusCode() {
        return 1000;
    }
}