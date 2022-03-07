import ApplicationError from "../../lib/error.js";

export default class NoDatabase extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            Database is not find in Confing.
            Please confirm whether the relevant configuration exists in the configuration file
        `
    }

    get statusCode() {
        return 1003
    }
}