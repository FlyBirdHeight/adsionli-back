/**
 * @method deleteFile 删除文件
 * @param {*} path 文件路径
 */
const deleteFile = function (path) {
    if (!this.judgeExist(path)) {
        throw new Error("当前文件路径不存在:" + path)
    }
    this.fs.unlinkSync(path);
    return this;
}
/**
 * @method deleteDirectory 删除文件目录
 * @param {string} path 目录地址
 */
const deleteDirectory = async function (path) {
    try {
        if (!this.judgeExist(path)) {
            throw new Error("当前目录路径不存在:" + path)
        }
        await this.fs.promises.rm(path, {
            recursive: true,
            force: true
        })
        return true
    } catch (e) {
        throw e;
    }
}
/**
 * @method deleteFilesInDirectory 删除目录下的全部文件
 * @param {*} path 
 */
const deleteFilesInDirectory = async function (path) {
    try {
        let fileList = await this.getFilesInDirectory(path);
        if (fileList.length == 0) {
            return true;
        }
        for (let v of fileList) {
            this.deleteFile(v);
        }
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

export {
    deleteFile,
    deleteDirectory,
    deleteFilesInDirectory
}