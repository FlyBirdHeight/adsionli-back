import ApplicationError from "../../lib/error";

export default class FilterError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get statusCode() {
        return 2001
    }
}
