import Image from "../../../model/file/image.js"
import Files from "../../../model/file/files.js"
import Busboy from "busboy";
import fs from "fs";
import path from "path";
import Service from "../../../lib/service.js";
import DeleteFileError from "../../../error/service/file/files/delete_file_error.js";
class ImageService extends Service {
    constructor() {
        super();
        this.model = new Image();
        this.fileModel = new Files()
        this.defaultPath = path.resolve(global.__dirname, 'public/images');
        this.defaultMergeImagePath = path.resolve(global.__dirname, 'public/file/images')
        this.defaultMergePagePath = path.resolve(global.__dirname, 'pbulic/file/pages')
        this.fileLinkPath = path.resolve(global.__dirname, 'public/file/link')
        this.slicePath = path.resolve(global.__dirname, 'public/file/slice')
    }

    /**
     * @method uploadImage 上传图片
     * @param {any} req
     */
    async uploadImage(req) {
        try {
            let insertData = await this.handleImageSave(req);
            let status = await this.model.insertImage(insertData.data);
            if (status.rewrite) {
                return {
                    status: false,
                    message: "上传失败，当前图片名称已存在",
                    rewrite: status.rewrite,
                    url: status.url,
                    id: status.id
                }
            } else {
                return {
                    status: true,
                    message: "上传并保存成功",
                    rewrite: status.rewrite,
                    url: status.url,
                }
            }

        } catch (e) {
            throw e;
        }
    }

    /**
     * @method handleImageSave 处理图片保存问题
     */
    handleImageSave(req) {
        let _this = this;
        let url = '/images';
        if (Reflect.has(req.body, 'path')) {
            url = req.body.path
        }
        return new Promise((resolve, reject) => {
            let body = req.body;
            let path = _this.defaultPath;
            let fileName = '';
            let busboy = Busboy({
                headers: req.headers
            })
            if (Reflect.has(body, 'path')) {
                path = path + body.path
            }
            let size = 0;
            req.pipe(busboy);
            busboy.on('file', function (name, file, info) {
                const { filename, encoding, mimeType } = info;
                fileName = filename;
                if (name !== 'image') {
                    reject({
                        status: false,
                        message: "上传文件类型不是图片"
                    })
                }
                path = path + '/' + filename;
                url += '/' + filename;
                let writeStream = fs.createWriteStream(path);
                file.on('data', (data) => {
                    size += data.length
                    writeStream.write(data);
                })
                file.on('end', function (data) {
                    writeStream.end();
                })
            })
            busboy.on('finish', function () {
                resolve({
                    status: true,
                    message: "上传成功",
                    data: {
                        path,
                        name: fileName,
                        url,
                        size
                    }
                });
            })
        })
    }

    /**
     * @method getList 获取图片列表
     * @param {*} options 获取参数
     */
    async getList(options) {
        let finder = {
            select: '*',
            page: 1,
            count: 8,
            sort: {
                name: "created_at",
                type: "desc"
            }
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
        if (Reflect.has(options, 'sort')) {
            finder.sort = options.sort;
        }
        if (Reflect.has(options, 'count')) {
            finder.count = options.count;
        }
        if (Reflect.has(options, 'page')) {
            finder.page = options.page
        }
        let data = await this.model.find(finder);
        let total = await this.model.getCount();

        return {
            data,
            total
        }
    }

    /**
     * @method getInfo 获取文件信息
     * @param {number} id 文件id
     */
    getInfo(id) {
        return this.model.findById(id);
    }

    /**
     * @method verify 判断图片是否存在
     * @param {{name: string, hash: string}} data 等待查询数据
     * @return {exist: boolean, type: number} exist 是否存在, 存在类型：0未上传 1部分上传 2完全上传
     */
    async verify(data) {
        let dbCount = await this.model.find({
            where: {
                hash_tag: data.hash
            }
        })

        if (dbCount.length != 0) {
            return {
                exist: true,
                type: 2,
                url: dbCount[0].url
            }
        }

        return {
            exist: false,
            type: 0
        }
    }

    /**
     * @method saveSlice 保存分片数据
     * @param {*} request 请求体
     */
    saveSlice(request) {
        let _this = this;
        return new Promise((resolve, reject) => {
            try {
                let busboy = Busboy({
                    headers: request.headers
                })
                let additional = {};
                additional['path'] = this.slicePath;
                /**
                 * README: 这里busboy有个奇怪的坑，就是无法对field在后面的时候进行处理，
                 *         只能在传过来的formData中将file放在最后才可以，所以传过来的时候要注意一下
                 */
                busboy.on('file', async function (name, file, info) {
                    let returnData = await _this.fileHandle.saveSlice(file, additional);
                    resolve({
                        status: true
                    })
                })
                busboy.on('field', function (name, value, info) {
                    additional[name] = value;
                })
                //NOTE: 通过管道，把request中内容写入到busboy中
                request.pipe(busboy);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }

    /**
     * @method mergeSlice 合并图片
     * @param {*} fileInfo 合并文件内容
     */
    async mergeSlice(fileInfo) {
        try {
            let savePath = fileInfo.type == 'image' ? this.defaultMergeImagePath : this.defaultMergePagePath;
            let linkPath = path.resolve(this.fileLinkPath, `./${fileInfo.path}`);
            let status = await this.fileHandle.saveMerge({
                name: fileInfo.name,
                hash_key: fileInfo.hash_key,
                linkPath,
                savePath,
                sliceCount: fileInfo.sliceCount,
                type: fileInfo.type
            })
            let relativeLinkPath = '/' + path.relative(this.fileLinkPath.replace('/file/link', ''), status.linkPath);
            if (status.status) {
                this.event.emit('delete_slice', [fileInfo.hash_key, fileInfo.sliceCount])
                this.event.emit('save_file', [status.fullPath, status.name, fileInfo.is_create, {
                    link_path: path.resolve(status.linkPath, status.name),
                    size: fileInfo.size,
                    type: fileInfo.type,
                    relativeLinkPath,
                    hash_tag: fileInfo.hash_key,
                    directoryPath: status.linkPath
                }])
            }
            return { status, url: Files.generateUrl(relativeLinkPath) + '/' + fileInfo.name };
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method renameFile 修改文件名称
     * @param {{id: number, name: string, oldName: string}} data 修改文件数据
     */
    async renameFile(data) {
        try {
            let findData = await this.model.findById(data.id);
            if (findData.length < 1) {
                throw new Error("当前文件不存在")
            }
            let file = findData[0];
            let oldNameList = data.oldName.split('.');
            let newName = data.name + '.' + oldNameList[oldNameList.length - 1];
            let linkPath = file.link_path.replace(data.oldName, newName);
            let url = file.url.replace(data.oldName, newName);
            let status = await this.model.update({
                set: {
                    name: newName,
                    link_path: linkPath,
                    url
                },
                where: {
                    id: data.id
                }
            })
            await this.fileHandle.renameFile(file.link_path, linkPath);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }

    }

    /**
     * @method deleteFile 删除文件
     * @param {{id: number}} options 删除信息
     * @description 主要就是从数据库中删除文件，并且删除软链接文件以及原始文件
     */
    async deleteFile(options) {
        try {
            let data = await this.fileModel.findById(options.id);
            if (data.length == 0) {
                throw new DeleteFileError("The current file does not exist!", {
                    id: options.id
                })
            }
            let fileInfo = data[0];
            let path = fileInfo.path;
            let linkPath = fileInfo.link_path;
            await this.fileHandle.deleteFile(linkPath);
            await this.fileHandle.deleteFile(path);
            let status = await this.fileModel.deleteById(options.id);
            if (fileInfo.type == 0) {
                this.event.emit('update_directory_image_count', [fileInfo.directory_id, -1]);
                this.event.emit('update_directory_size', [fileInfo.directory_id, -1 * Number(fileInfo.size)]);
            }
            return true;
        } catch (e) {
            console.log(e);
            throw new DeleteFileError(e.message, {
                id: options.id,
                url: fileInfo.url
            })
        }
    }

    /**
     * @method changePath 修改文件路径
     * @param {{id: number, directory_id: number, relative_path: string, oldPath: string}} options 修改内容
     */
    async changePath(options) {
        try {
            let selectData = await this.fileModel.findById(options.id);
            if (selectData.length == 0) {
                return false;
            }
            let fileInfo = selectData[0]
            let targetPath = fileInfo.link_path;
            let sourcePath = targetPath.replace(options.oldPath, options.relative_path);
            let newUrl = fileInfo.url.replace(options.oldPath, options.relative_path);

            this.fileHandle.changeFilePath(targetPath, sourcePath, fileInfo.path);

            await this.fileModel.update({
                set: {
                    directory_id: options.directory_id,
                    link_path: sourcePath,
                    url: newUrl
                },
                where: {
                    id: fileInfo.id
                }
            })
            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}

export { ImageService }