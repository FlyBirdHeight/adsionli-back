import ApplicationError from "../../../../lib/error.js";
class WithNotHaveFn extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:进行联合查询时，当前model中未创建当前传入方法: ${Reflect.has(options, 'fn') ? options.fn : ''}!`;
    }

    get statusCode() {
        return 1134;
    }
}

export default WithNotHaveFn;

