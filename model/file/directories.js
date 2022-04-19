import Models from "../../lib/model";

class Directories extends Models {
    constructor() {
        super('local', 'directory', 'directories', [
            'name', 'level', 'parent_id', 'full_path'
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
     * @method getInfoWithFileAndDirectory 获取文件夹信息及其子文件与子文件夹
     * @param {number} id 文件夹id
     */
    getInfoWithFileAndDirectory(id) {
        return this.with(['hasManyDirectories', 'hasManyFiles']).find({
            where: {
                parent_id: id,
                id: {
                    type: "!=",
                    data: id
                }
            }
        });
    }
}

export default Directories;