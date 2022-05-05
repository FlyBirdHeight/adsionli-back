import Models from "../../lib/model";

class Directories extends Models {
    constructor() {
        super('local', 'directory', 'directories', [
            'name', 'level', 'parent_id', 'relative_path', 'real_path'
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
                    relative_path: path
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
     * @param {{name: string, level: number, parent_id: number, relative_path: string, real_path: string}} info 文件目录信息
     */
    addDirectory(info) {
        return this.insert(info);
    }

    /**
     * @method getId 获取文件目录id
     * @param {string} relative_path 
     */
    getId(relative_path) {
        return this.find({
            select: "id",
            where: {
                relative_path
            }
        })
    }

    /**
     * @method updateInfo 更新文件目录内容：size:大小  directory_count: 目录数量 image_count: 图片数量
     * @param { {id: number, type: string, data: number }} options 更新数据内容
     */
    async updateInfo(options) {
        try {
            let selectMember = options.type;
            let dirInfo = await this.find({
                select: selectMember,
                where: {
                    id: options.id
                }
            })
            dirInfo = dirInfo[0];
            let updateInfo = {
                set: {},
                where: {}
            }
            updateInfo.set[options.type] = Number(dirInfo[options.type]) + Number(options.data);
            updateInfo.where['id'] = options.id;

            let status = await this.update(updateInfo);
            return status;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method getInfoWithFileAndDirectory 获取文件夹信息及其子文件与子文件夹
     * @param {number} id 文件夹id
     * @param {boolean} first 第一次请求根目录
     */
    getInfoWithFileAndDirectory(id, first = false) {
        let where;
        where = {
            id: id
        }
        return this.with(['hasManyDirectories', 'hasManyFiles']).find({
            where
        });
    }

    /**
     * @method updateDirectoryPath 更新目录路径,本身与子集
     * @param {Directories} directory 源路径
     * @param {{name: string, oldName: string}} options 修改信息
     * @param {boolean} returnSql 是否返回sql且不执行
     */
    updateDirectoryPath(directory, options, returnSql = true) {
        return this.update({
            set: {
                relative_path: {
                    noEdit: true,
                    data: `concat('${directory.relative_path.replace(options.oldName, options.name)}', substring(relative_path, char_length('${directory.relative_path}') + 1))`
                },
                real_path: {
                    noEdit: true,
                    data: `concat('${directory.real_path.replace(options.oldName, options.name)}', substring(real_path, char_length('${directory.real_path}') + 1))`
                },
            },
            where: {
                relative_path: {
                    type: "like",
                    data: `${directory.relative_path}%`
                }
            }
        }, returnSql);
    }
}

export default Directories;