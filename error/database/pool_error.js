import ApplicationError from "../../lib/error.js";
class PoolError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            Database pool connect has some error: ${message},
            sqlMessage: ${Reflect.has(options, 'sqlMessage') ? options.sqlMessage : 'null'},
            errorCode: ${this.statusCode}
        `
    }

    get statusCode() {
        return 1001
    }
}

export default PoolError