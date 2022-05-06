import ApplicationError from "../../../../lib/error.js";

export default class CreateDirectoryError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            File directory creation failed!
            Reason: ${this.message},
            Name: ${options.name},
            RelativePath: ${options.relative_path || ""}
        `
    }

    get statusCode() {
        return 71101
    }
}