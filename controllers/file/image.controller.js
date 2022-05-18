import { ImageService } from "./service/image.service.js"
import path from "path"
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
                res.send({
                    status: true
                })
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
                let returnData = await imageService.saveSlice(req);
                res.send({
                    status: true
                })
            } catch (e) {
                console.log(e);
                res.status(500).end();
            }
        }
    },
    {
        method: "POST",
        path: "merge",
        handle: async (req, res) => {
            try {
                let returnData = await imageService.mergeSlice(req.body);
                res.send({
                    status: true
                })
            } catch (e) {
                console.log(e);
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
            res.download(path.relative(global.__dirname, data[0].path), data[0].name, (error) => {
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
                    data: data.data,
                    total: data.total
                })
            } catch (e) {
                console.log("error", e);
                res.status(500).send({
                    status: false,
                    error: e.toString || e.message
                })
            }
        }
    },
    {
        method: "GET",
        path: "info",
        handle: async (req, res) => {
            try {
                let data = await imageService.getInfo(req.query.id);
                if (data.length == 0) {
                    res.send({
                        status: true,
                        data: null
                    })
                } else {
                    res.send({
                        status: true,
                        data: data[0]
                    })
                }
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

exports.update = [
    {
        method: "PUT",
        description: "文件重命名",
        path: "rename",
        handle: async (req, res) => {
            try {
                await imageService.renameFile(req.body);
                res.send({
                    status: true,
                    data: "修改成功"
                })
            } catch (e) {
                res.send({
                    status: false,
                    data: e.toString || e.message
                })
            }
        }
    },
    {
        method: "PUT",
        description: "文件移动",
        path: "path",
        handle: async (req, res) => {
            try {
                let status = await imageService.changePath(req.body);
                res.send({
                    status: true,
                    data: status
                })
            } catch (e) {
                res.status(500).send({
                    status: false,
                    message: e.message || e.toString
                })
            }
        }
    }
]

exports.delete = {
    method: "DELETE",
    description: "文件删除",
    handle: async (req, res) => {
        try {
            let responseData = await imageService.deleteFile(req.body);
            res.send({
                status: true,
                data: true
            })
        } catch (e) {
            console.log(e);

            res.status(500).send({
                status: false,
                message: e.toString || e.message
            })
        }
    }
}