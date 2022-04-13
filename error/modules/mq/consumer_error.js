import ApplicationError from "../../../lib/error.js";

export default class ConsumerError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            Consumer has encountered an error while processing data！
            Consumer: ${Reflect.has(options, 'consumer') ? options.consumer : 'not setting'},
            Error: ${options.error}
        `
    }

    get statusCode() {
        return 61002
    }
}