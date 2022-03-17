import ApplicationError from "../../../lib/error.js";
class WhereError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + ':在使用where时，未定义Where数据，无法进行检索';
    }

    get statusCode() {
        return 1101;
    }
}

export default WhereError;

