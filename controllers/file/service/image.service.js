import Image from "../../../model/file/image"
import Busboy from "busboy";
import fs from "fs";
class ImageService {
    constructor() {
        this.model = new Image();
        this.defaultPath = `${global.__dirname}/public/images`
    }

    /**
     * @method uploadImage 上传图片
     * @param {any} req
     */
    async uploadImage(req) {
        try {
            let insertData = await this.handleImageSave(req);
            let status = await this.model.insert(insertData.data);
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
}

export { ImageService }