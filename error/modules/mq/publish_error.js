import ApplicationError from "../../../lib/error.js";

export default class PublishError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            An error occurred while the producer was sending data to the message queue！
            Producer: ${Reflect.has(this, 'producer') ? this.producer : 'not setting'},
            Error: ${this.error}
        `
    }

    get statusCode() {
        return 61001
    }
}