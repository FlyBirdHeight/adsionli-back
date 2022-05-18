/**
 * @method changeDirectoryPath 修改目录路径
 * @param {string} targetPath 原路径
 * @param {string} sourcePath 目标路径
 * @returns {boolean}
 */
const changeDirectoryPath = function (targetPath, sourcePath) {
    console.log(targetPath, sourcePath);
}
/**
 * @method changeFilePath 修改文件路径
 * @param {string} targetPath 原路径
 * @param {string} sourcePath 目标路径
 * @returns {boolean}
 */
const changeFilePath = function (targetPath, sourcePath) {
    try {
        this.fs.copyFileSync(targetPath, sourcePath, this.fs.constants.COPYFILE_FICLONE);
        this.deleteFile(targetPath);

        return true;
    } catch (e) {
        throw new Error(e);
    }
}

export {
    changeDirectoryPath,
    changeFilePath
}