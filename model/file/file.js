import Model from "../../lib/model"
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
        return this.insert(info);
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
     * @param {string} path 存放地址
     */
    static generateUrl(path) {
        return `http://${global.netInfo.ip}:${global.netInfo.host}${path}`
    }
}

export default Files