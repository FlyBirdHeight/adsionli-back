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

        return this.directoryModel.find(finder);
    }
    /**
     * @method renameDirectory 修改目录名称
     * @param {{id: number, name: string, oldName: string}} options 修改目录名称内容
     */
    async renameDirectory(options) {
        try {
            let data = await this.directoryModel.findById(options.id);
            if (data.length < 1) {
                throw new Error("当前目录不存在")
            }
            let directory = data[0];
            console.log(1111);

            /**
             * README: 这里已经开启事务了,但是这里有一些需要注意的，不能直接使用Model里面的方法了，
             *          因为走的connect不是同一个，就没办法commit或者rollback了！
             */
            let connection = await this.directoryModel.startAffair(true);
            let updateNameSql = await this.directoryModel.update({
                set: {
                    name: options.name,
                },
                where: {
                    id: options.id
                }
            }, true)

            let updateDirectoryPath = await this.directoryModel.update({
                set: {
                    relative_path: {
                        noEdit: true,
                        data: `concat('${directory.relative_path.replace(options.oldName, options.name)}', substring(relative_path, char_length('${directory.relative_path}') + 1))`
                    },
                    real_path: {
                        noEdit: true,
                        data: `concat('${directory.real_path.replace(options.oldName, options.name)}', substring(relative_path, char_length('${directory.relative_path}') + 1))`
                    },
                },
                where: {
                    relative_path: {
                        type: "like",
                        data: `${directory.relative_path}%`
                    }
                }
            }, true)
            let updateFilePath = await this.fileModel.update({
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
            }, true)
            console.log(updateNameSql.sql);
            console.log(updateDirectoryPath.sql);
            console.log(updateFilePath.sql);
            console.log(456);

            await connection.commit();
            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

export default FileService