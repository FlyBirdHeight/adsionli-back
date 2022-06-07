import Service from "../../../lib/service.js";
import Directories from "../../../model/file/directories.js";
import Files from "../../../model/file/files.js"
import CreateDirectoryError from "../../../error/service/file/directories/create_directory_error.js";
import DeleteDirectoryError from "../../../error/service/file/directories/delete_directory_error.js";
import ChangeDirectoryPathError from "../../../error/service/file/directories/change_directory_path_error.js";
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

    /**
     * @method createDirectory 创建目录
     * @param {{name: string, parent_id: number}} options 创建内容
     */
    async createDirectory(options) {
        let findData = await this.directoryModel.findById(options.parent_id);
        if (findData.length == 0) {
            throw new CreateDirectoryError("The current parent directory does not exist", {
                name: options.name,
                relative_path: ""
            })
        }
        let parentInfo = findData[0];
        options.relative_path = parentInfo.relative_path + '/' + options.name;
        options.real_path = parentInfo.real_path + '/' + options.name;
        options.level = parentInfo.level + 1;
        try {
            await this.fileHandle.mkdirDirectory(options.real_path, false);
            let status = await this.directoryModel.insert(options);
            this.event.emit('update_directory_count', [options.parent_id, 1]);
            return true;
        } catch (e) {
            console.log(e);
            throw new CreateDirectoryError(e.message, {
                name: options.name,
                relative_path: options.real_path
            })
        }
    }

    /**
     * @method deleteDirectory 删除目录文件
     * @param {{id: number}} options 待删除数据
     */
    async deleteDirectory(options) {
        //NOTE: 开启事务进行删除，为了保证不会发生错误
        let connection = await this.directoryModel.startAffair(true);
        try {
            let deleteSql = await this.directoryModel.deleteById(options.id, true);
            let findData = await this.directoryModel.findById(options.id);
            if (findData.length == 0) {
                throw new DeleteDirectoryError("当前文件目录不存在!", options.id)
            }
            let dir = findData[0];
            await connection.query(deleteSql);
            //TODO: 这里是否要放到events中去执行，执行失败放入消息队列，然后继续重新处理？先同步执行好了
            await this.fileHandle.deleteFilesInDirectory(dir.real_path);
            await this.fileHandle.deleteDirectory(dir.real_path);
            await connection.commit()
            return true;
        } catch (e) {
            await connection.rollback();
            console.log(e);
            throw new DeleteDirectoryError(e.message, {
                id: options.id
            })
        }
    }

    /**
     * @method changePath 修改目录路径
     * @param {{id: number, directory_id: number, relative_path: string, oldPath: string}} options 修改内容
     */
    async changePath(options) {
        let findData = await this.directoryModel.findById(options.directory_id);
        let directoryData = await this.directoryModel.findById(options.id);
        if (findData.length == 0 || directoryData.length == 0) {
            throw new ChangeDirectoryPathError('父级/本目录不存在', {
                id: options.id,
                relative_path: options.relative_path
            })
        }
        let selfInfo = directoryData[0]
        let connection = await this.directoryModel.startAffair(true);
        try {
            let updateNameSql = await this.directoryModel.update({
                set: {
                    parent_id: options.directory_id,
                    level: findData[0].level + 1
                },
                where: {
                    id: options.id
                }
            }, true)
            let updateDirectoryPath = await this.directoryModel.updateDirectoryPath(selfInfo, { name: options.relative_path, oldName: options.oldPath }, true);
            let updateFilePath = await this.fileModel.updateFileUrlAndPath(selfInfo, { name: options.relative_path, oldName: options.oldPath }, true)
            await connection.query(updateNameSql);
            await connection.query(updateDirectoryPath);
            await connection.query(updateFilePath);
            this.fileHandle.changeDirectoryPath(selfInfo.real_path, selfInfo.real_path.replace(options.oldPath, options.relative_path));
            await connection.commit();

            return true;
        } catch (e) {
            await connection.rollback();
            throw new ChangeDirectoryPathError(e.message, {
                id: options.id,
                relative_path: options.relative_path
            })
        }
    }
}

export default FileService