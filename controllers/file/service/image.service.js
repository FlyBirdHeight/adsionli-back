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
    uploadImage(req) {
        let _this = this;
        return new Promise((resolve, reject) => {
            let body = req.body;
            let path = _this.defaultPath;
            let busboy = Busboy({
                headers: req.headers
            })
            if (Reflect.has(body, 'path')) {
                path = path + body.path
            }
            req.pipe(busboy)
            busboy.on('file', function (name, file, info) {
                const { filename, encoding, mimeType } = info;
                if (name !== 'image') {
                    reject({
                        status: false,
                        message: "上传文件类型不是图片"
                    })
                }
                path = path + '/' + filename;
                let writeStream = fs.createWriteStream(path);
                file.on('data', (data) => {
                    writeStream.write(data);
                })
                file.on('end', function (data) {
                    writeStream.end();
                })
            })
            busboy.on('finish', function () {
                resolve({
                    status: true,
                    message: "上传成功"
                });
            })
        })
    }
}

export { ImageService }