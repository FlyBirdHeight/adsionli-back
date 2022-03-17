class ApplicationError extends Error {
    constructor(message, options = {}) {
        if (typeof message !== 'string') {
            return;
        }
        if(typeof options !== 'object'){
            return;
        }
        
        super(message);

        // Attach relevant information to the error instance
        // (e.g., the username).
        for (const [key, value] of Object.entries(options)) {
            this[key] = value;
        }
    }

    get name() {
        return this.constructor.name;
    }
}
export default ApplicationError;