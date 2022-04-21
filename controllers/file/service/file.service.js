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
     * @param {boolean} first 是否是第一次请求，第一次请求要稍微特殊一些，只获取public下的内容
     */
    getDirectoryInfo(id, first = false){
        return this.directoryModel.getInfoWithFileAndDirectory(id, first);
    }
}

export default FileService