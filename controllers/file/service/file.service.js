import Service from "../../../lib/service";
import Directories from "../../../model/file/directories";

class FileService extends Service {
    constructor() {
        super();
        this.directoryModel = new Directories();
    }

    /**
     * @method getDirectoryInfo 获取文件夹列表
     * @param {number} id 父文件夹id
     */
    getDirectoryInfo(id){
        return this.directoryModel.getInfoWithFileAndDirectory(id);
    }
}

export default FileService