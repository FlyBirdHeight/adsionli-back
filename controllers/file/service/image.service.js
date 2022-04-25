import Image from "../../../model/file/image"
import Busboy from "busboy";
import fs from "fs";
class ImageService {
    constructor() {
        this.model = new Image();
        this.defaultPath = `${global.__dirname}/public`
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
    getList(options) {
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

        return this.model.find(finder);
    }

    /**
     * @method getInfo 获取文件信息
     * @param {number} id 文件id
     */
    getInfo(id) {
        return this.model.findById(id);
    }

    /**
     * @method upload 上传文件
     * @param {*} req
     */
    upload(req) {
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
                console.log(info);
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
     * @method verify 判断图片是否存在
     * @param {{name: string, hash: string}} data 等待查询数据
     * @return {exist: boolean, type: number} exist 是否存在, 存在类型：0未上传 1部分上传 2完全上传
     */
    async verify(data) {
        let dbCount = await this.model.find({
            select: "count(*) as count",
            where: {
                _link: "or",
                name: data.name,
                hash_tag: data.hash
            }
        })
        console.log(dbCount);
        
        if (dbCount[0].count != 0) {
            return {
                exist: true,
                type: 2
            }
        }

        return {
            exist: false,
            type: 0
        }
    }
}

export { ImageService }