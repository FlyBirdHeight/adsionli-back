import ApplicationError from "../../../../lib/error.js";
class WhereKeyObjectError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:进行查询操作时，传入的待查询数据为对象，但未指定data(数据部分)，请确保数据部分不为空!`;
    }

    get statusCode() {
        return 1131;
    }
}

export default WhereKeyObjectError;

