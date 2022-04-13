import ApplicationError from "../../../lib/error.js";

export default class PublishError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            An error occurred while the producer was sending data to the message queue！
            Producer: ${Reflect.has(options, 'producer') ? options.producer : 'not setting'},
            Error: ${options.error}
        `
    }

    get statusCode() {
        return 61001
    }
}