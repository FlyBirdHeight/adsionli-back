import { ImageService } from "./service/image.service.js"
const imageService = new ImageService();
/**
 * @method upload 上传图片文件
 */
exports.upload = [
    {
        method: "POST",
        path: "one",
        handle: async (req, res) => {
            try {
                let returnData = await imageService.uploadImage(req);
                res.send(returnData)
            } catch (e) {
                console.log(e);
            }
        }
    },
    {
        method: "POST",
        path: "any",
        handle: async (req, res) => {
            console.log(req.body.file);
            res.send({
                status: true
            })
        }
    },
    {
        method: "POST",
        path: "slice",
        handle: async (req, res) => {
            try {
                console.log(req.body);
                res.send({
                    status: true
                })
            } catch (e) {
                res.status(500).end();
            }
        }
    }
]
/**
 * @method download 下载图片文件
 */
exports.download = {
    method: "GET",
    handle: async (req, res) => {
        try {
            let data = await imageService.getInfo(req.query.id);
            res.download(data[0].path, data[0].name, (error) => {
                console.log("error", error);
            })
        } catch (e) {
            console.log("error", e);

            res.status(500).send({
                status: false,
                message: "文件不存在！"
            })
        }
    }
}
/**
 * @method getImageFileList 获取图片文件列表
 */
exports.get = [
    {
        method: "POST",
        path: "list",
        handle: async (req, res) => {
            try {
                let data = await imageService.getList(req.body);
                res.send({
                    status: true,
                    data
                })
            } catch (e) {
                console.log("error", e);
                res.status(500).send({
                    status: false,
                    error: e.toString || e.message
                })
            }
        }
    }
]

exports.verify = {
    method: "POST",
    handle: async (req, res) => {
        try {
            let returnData = await imageService.verify(req.body);
            res.send(Object.assign({
                status: true
            }, returnData))
        } catch (e) {
            console.log(e);
            res.status(500).send({
                status: false,
                error: e.toString || e.message
            })
        }
    }
}

/**
 * @method deleteImageFile 删除图片文件或文件夹
 */
exports.deleteImageFile = {
    method: "DELETE",
    handle: async (req, res) => {

    }
}
/**
 * @method updateImageInfo 更新图片文件或文件夹
 */
exports.updateImageInfo = {
    method: "PUT",
    handle: async (req, res) => {

    }
}