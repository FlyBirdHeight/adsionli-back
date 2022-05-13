import ApplicationError from "../../../../lib/error.js";

export default class DeleteFileError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            File deletion failed!
            Reason: ${this.message},
            FileId: ${this.id},
            Url: ${this.url || ""}
        `
    }

    get statusCode() {
        return 71201
    }
}