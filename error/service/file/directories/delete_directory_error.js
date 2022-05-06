import ApplicationError from "../../../../lib/error.js";

export default class DeleteDirectoryError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            File directory delete failed!
            Reason: ${this.message},
            DirectoryId: ${options.id},
        `
    }

    get statusCode() {
        return 71102
    }
}