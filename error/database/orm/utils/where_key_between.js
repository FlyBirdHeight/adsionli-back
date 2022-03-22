import ApplicationError from "../../../../lib/error.js";
class WhereKeyBetweenError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:进行查询操作时，传入between后，待搜索数据必须是数组，且至少包含一个数据!`;
    }

    get statusCode() {
        return 1133;
    }
}

export default WhereKeyBetweenError;

