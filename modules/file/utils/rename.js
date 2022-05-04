/**
 * README: 专门用来处理文件重命名之后的操作
 */
/**
 * @method rename 修改文件名称
 * @param {string} oldPath 老的路径
 * @param {string} newPath 新的路径
 */
const renameFile = async function (oldPath, newPath) {
    try {
        let status = this.judgeExist(oldPath)
        if (!status) {
            throw new Error("文件路径不存在")
        }
        this.fs.renameSync(oldPath, newPath);
        return true
    } catch (e) {
        throw new Error(e);
    }
}
/**
 * @method rename 修改目录名称
 * @param {string} oldPath 老的路径
 * @param {string} newPath 新的路径
 */
const renameDirectory = function (oldPath, newPath) {
    try {
        let status = this.judgeExist(oldPath)
        if (!status) {
            throw new Error("文件路径不存在")
        }
        this.fs.renameSync(oldPath, newPath);
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

export {
    renameFile,
    renameDirectory
}