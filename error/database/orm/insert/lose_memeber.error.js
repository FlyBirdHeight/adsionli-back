import ApplicationError from "../../../../lib/error.js";
class InsertLoseMember extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return this.message + `:在进行插入操作时，缺少${this.memeber}数据，请确保数据完全！`;
    }

    get statusCode() {
        return 1111;
    }
}

export default InsertLoseMember;

