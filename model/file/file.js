import Model from "../../lib/model"
import ImageInsertFilter from "../../filter/file/ImageInsertFileter"
const host = 3000;
let ipConfig = "127.0.0.1";

class Files extends Model {
    constructor() {
        super('local', 'files', 'files', [
            'path', 'type', 'name', 'description', 'url', 'size', 'directory_id', 'hash_tag', 'link_path'
        ]);
    }


    /**
     * @method addFile 添加文件
     * @param {{path: string, type: number, name: string, description: string, url: string, size: number, directory_id: number, hash_tag: string, link_path: string}} info
     */
    addFile(info) {
        return this.insert();
    }

    /**
     * @method getFileInfo 获取文件详情
     * @param {number} id
     */
    getFileInfo() {
        return this.findById(id);
    }

    /**
     * @method generateUrl 生成外链
     * @param {string} ip ip地址
     * @param {string} path 存放地址
     */
    static generateUrl(ip, path) {
        return `http://${ip}:${host}${path}`
    }
}

export default Files