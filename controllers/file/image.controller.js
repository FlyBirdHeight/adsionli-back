/**
 * @method upload 上传图片文件
 */
exports.upload = {
    method: "POST",
    handle: async (req, res) => {
        console.log(req.body)
        res.send("hello")
    }
}
/**
 * @method download 下载图片文件
 */
exports.download = {
    method: "POST",
    handle: async (req, res) => {
        console.log(req.params);
    }
}
/**
 * @method getImageFileList 获取图片文件列表
 */
exports.getImageFileList = {
    method: "GET",
    handle: async (req, res) => {

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