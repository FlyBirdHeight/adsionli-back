import Service from "../../../lib/service";

class FileService extends Service {
    constructor() {
        super();
        this.dailyModel = new Daily();
    }
}

export default FileService