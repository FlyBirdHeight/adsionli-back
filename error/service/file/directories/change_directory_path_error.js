import ApplicationError from "../../../../lib/error.js";

export default class ChangeDirectoryPathError extends ApplicationError {
    constructor(message, options = {}) {
        super(message, options)
    }

    get toString() {
        return `
            Change Directory Path failed!
            Reason: ${this.message},
            id: ${this.id},
            RelativePath: ${this.relative_path || ""}
        `
    }

    get statusCode() {
        return 71103
    }
}