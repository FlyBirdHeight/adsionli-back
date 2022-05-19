/**
 * @method changeDirectoryPath 修改目录路径
 * @param {string} targetPath 原路径
 * @param {string} sourcePath 目标路径
 * @returns {boolean}
 */
const changeDirectoryPath = async function (targetPath, sourcePath) {
    await this.renameFile(targetPath, sourcePath);
    
    return true;
}
/**
 * @method changeFilePath 修改文件路径
 * @param {string} targetPath 原路径
 * @param {string} sourcePath 目标路径
 * @param {string} realPath 真实路径
 * @returns {boolean}
 */
const changeFilePath = function (targetPath, sourcePath, realPath) {
    try {
        this.deleteFile(targetPath);
        this.createLink(realPath, sourcePath);

        return true;
    } catch (e) {
        throw new Error(e);
    }
}

export {
    changeDirectoryPath,
    changeFilePath
}