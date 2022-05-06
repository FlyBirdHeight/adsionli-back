import Model from "../../lib/model.js"
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

    /**
     * @method updateFileUrlAndPath 更新文件url与path，基于目录路径被修改
     * @param {Directories} directory 源路径
     * @param {{name: string, oldName: string}} options 修改信息
     * @param {boolean} returnSql 是否返回sql且不执行
     */
    updateFileUrlAndPath(directory, options, returnSql = true) {
        return this.update({
            set: {
                url: {
                    noEdit: true,
                    data: `concat(substring_index(url, '${directory.relative_path}', 1), '${directory.relative_path.replace(options.oldName, options.name)}',substring(url, char_length(concat(substring_index(url, '${directory.relative_path}', 1), '${directory.relative_path}')) + 1))
                `
                },
                link_path: {
                    noEdit: true,
                    data: `concat('${directory.real_path.replace(options.oldName, options.name)}',substring(link_path, char_length('${directory.real_path}') + 1))`
                }
            },
            where: {
                url: {
                    type: "like",
                    data: `%${directory.relative_path}%`
                }
            }
        }, returnSql);
    }
}

export default Files