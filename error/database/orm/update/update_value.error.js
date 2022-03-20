import ApplicationError from "../../../../lib/error.js";
class UpdateValueError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + ':在进行更新操作时，传入数据未包含set属性，无法确定要更新项，请确保set项的正确传入！';
    }

    get statusCode() {
        return 1122;
    }
}

export default UpdateValueError;

