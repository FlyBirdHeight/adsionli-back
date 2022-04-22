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
    getDirectoryInfo(id, first = false) {
        return this.directoryModel.getInfoWithFileAndDirectory(id, first);
    }

    /**
     * @method getInfo 获取文件夹相关内容
     * @param {*} options 检索数据内容
     */
    getInfo(options) {
        let finder = {
            select: '*'
        }
        if (Reflect.has(options, 'select')) {
            if (Array.isArray(options.select)) {
                finder.select = options.select.length > 1 ? options.select.join(',') : options.select[0]
            } else {
                finder.select = options.select;
            }
        }
        if (Reflect.has(options, 'where')) {
            finder.where = options.where;
        }
        
        return this.directoryModel.find(finder);
    }
}

export default FileService