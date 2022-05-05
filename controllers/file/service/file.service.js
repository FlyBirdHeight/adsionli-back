import Service from "../../../lib/service.js";
import Directories from "../../../model/file/directories.js";
import Files from "../../../model/file/file.js"
class FileService extends Service {
    constructor() {
        super();
        this.directoryModel = new Directories();
        this.fileModel = new Files();
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
        console.log(finder);
        
        return this.directoryModel.find(finder);
    }

    getById(id) {
        return this.directoryModel.findById(id);
    }
    /**
     * @method renameDirectory 修改目录名称
     * @param {{id: number, name: string, oldName: string}} options 修改目录名称内容
     */
    async renameDirectory(options) {
        /**
         * README: 这里已经开启事务了,但是这里有一些需要注意的，不能直接使用Model里面的方法了，
         *          因为走的connect不是同一个，就没办法commit或者rollback了！
         */
        let connection = await this.directoryModel.startAffair(true);
        try {
            let data = await this.directoryModel.findById(options.id);
            if (data.length < 1) {
                await connection.rollback();
                throw new Error("当前目录不存在")
            }
            let directory = data[0];
            //NOTE: 这里进行事务操作，完成对目录名称，文件路径的更新，按顺序执行下去，最后在修改真实路径
            let updateNameSql = await this.directoryModel.update({
                set: {
                    name: options.name,
                },
                where: {
                    id: options.id
                }
            }, true)
            let updateDirectoryPath = await this.directoryModel.updateDirectoryPath(directory, options, true);
            let updateFilePath = await this.fileModel.updateFileUrlAndPath(directory, options, true)
            await connection.query(updateNameSql);
            await connection.query(updateDirectoryPath);
            await connection.query(updateFilePath);
            await this.fileHandle.renameDirectory(directory.real_path, directory.real_path.replace(options.oldName, options.name));
            await connection.commit();
            return true;
        } catch (e) {
            console.log(e);
            await connection.rollback();
            throw e;
        }
    }
}

export default FileService