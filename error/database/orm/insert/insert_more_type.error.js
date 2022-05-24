import ApplicationError from "../../../../lib/error.js";
class InsertMoreTypeError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:在对${this.table}进行批量插入操作时，传入的数据格式非数组形式或长度为0！`;
    }

    get statusCode() {
        return 1112;
    }
}

export default InsertMoreTypeError;

