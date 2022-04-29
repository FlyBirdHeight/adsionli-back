import Models from "../../lib/model";

class Directories extends Models {
    constructor() {
        super('local', 'directory', 'directories', [
            'name', 'level', 'parent_id', 'full_path', 'real_path'
        ])
    }

    /**
     * @method hasManyFiles 一个文件夹拥有很多文件
     */
    hasManyFiles() {
        return this.hasMany('files', 'id', 'directory_id');
    }

    /**
     * @method hasManyDirectories 一个文件夹可以拥有多个文件夹
     */
    hasManyDirectories() {
        return this.hasMany(this.table, 'id', 'parent_id');
    }

    /**
     * @method hasDirectory 是否存在文件
     * @param {string} path 文件基于file的路径
     * @return {boolean}
     */
    async hasDirectory(path) {
        try {
            let data = await this.find({
                where: {
                    full_path: path
                }
            })

            return {
                data: data.length > 0 ? data[0] : null,
                has: data.length == 0 ? false : true
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method addDirectory 添加文件
     * @param {{name: string, level: number, parent_id: number, full_path: string, real_path: string}} info 文件目录信息
     */
    addDirectory(info) {
        return this.insert(info);
    }

    /**
     * @method getId 获取文件目录id
     * @param {string} full_path 
     */
    getId(full_path) {
        return this.find({
            select: "id",
            where: {
                full_path
            }
        })
    }

    /**
     * @method getInfoWithFileAndDirectory 获取文件夹信息及其子文件与子文件夹
     * @param {number} id 文件夹id
     * @param {boolean} first 第一次请求根目录
     */
    getInfoWithFileAndDirectory(id, first = false) {
        let where;
        if (first) {
            where = {
                parent_id: id,
                id: {
                    type: "!=",
                    data: id
                }
            }
        } else {
            where = {
                id: id
            }
        }
        return this.with(['hasManyDirectories', 'hasManyFiles']).find({
            where
        });
    }
}

export default Directories;