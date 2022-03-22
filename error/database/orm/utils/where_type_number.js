import ApplicationError from "../../../../lib/error.js";
class WhereTypeNumberError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:在进行查询时，使用${this.cal}时，传入的查询参数必须是数字类型!`;
    }

    get statusCode() {
        return 1132;
    }
}

export default WhereTypeNumberError;

